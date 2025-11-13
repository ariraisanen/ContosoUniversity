# Tasks: Student List Page Enhancement

**Input**: Design documents from `/specs/010-student-list-enhancement/`  
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/ui-components.md, quickstart.md

**Tests**: This feature does NOT include automated tests (manual testing only per project standards)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `contoso-university-ui/src/`
- **Backend**: `ContosoUniversity/` (no changes required for this feature)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare development environment and verify prerequisites

- [ ] T001 Verify frontend dev server running: `cd contoso-university-ui && npm run dev`
- [ ] T002 Verify backend API running: `cd ContosoUniversity && dotnet run`
- [ ] T003 Verify SQL Server container running (Docker or Podman)
- [ ] T004 Review existing StudentList.tsx implementation in contoso-university-ui/src/pages/students/StudentList.tsx
- [ ] T005 Review existing shadcn/ui components: Button, Input, Dialog, Select, Table in contoso-university-ui/src/components/ui/
- [ ] T006 Verify lucide-react icons available (ArrowUp, ArrowDown, ArrowUpDown, Chevrons, Search, X)

**Checkpoint**: Development environment ready, existing code reviewed

---

## Phase 2: Foundational (Custom Hooks - Blocking Prerequisites)

**Purpose**: Create reusable hooks that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until these hooks are complete

- [ ] T007 [P] Create useDebounce hook in contoso-university-ui/src/hooks/useDebounce.ts
- [ ] T008 [P] Create useStudentListParams hook for URL query param management in contoso-university-ui/src/hooks/useQueryParams.ts
- [ ] T009 Verify existing usePagination hook in contoso-university-ui/src/hooks/usePagination.ts (confirm setPageSize resets to page 1)

**Checkpoint**: Foundation ready - all custom hooks available for user stories

---

## Phase 3: User Story 1 - Real-Time Search (Priority: P1) 🎯 MVP

**Goal**: Enable real-time filtering of student list by name with debounced input

**Independent Test**: Type in search field and observe immediate filtering (after 400ms debounce) without clicking search button. Clear search and verify full list restores.

### Implementation for User Story 1

- [ ] T010 [US1] Add search input state to StudentList.tsx: searchInput, debouncedSearch (using useDebounce hook)
- [ ] T011 [US1] Update search Card component in StudentList.tsx to use controlled Input with value={searchInput}
- [ ] T012 [US1] Implement handleSearchChange handler in StudentList.tsx to update searchInput on keystroke
- [ ] T013 [US1] Update useEffect in StudentList.tsx to trigger fetchStudents when debouncedSearch changes
- [ ] T014 [US1] Update handleSearchClear handler in StudentList.tsx to reset searchInput and update URL params
- [ ] T015 [US1] Synchronize search state with URL query params using useStudentListParams hook in StudentList.tsx
- [ ] T016 [US1] Update results summary in StudentList.tsx to show filtered count when search is active
- [ ] T017 [US1] Add loading indicator during debounce period in StudentList.tsx
- [ ] T018 [US1] Update empty state message in StudentList.tsx to show "No students found matching '[term]'" when search has no results

**Checkpoint**: Real-time search fully functional - can search students by name with debouncing

---

## Phase 4: User Story 2 - Column Sorting (Priority: P1)

**Goal**: Enable sorting student list by clicking column headers (Last Name, First Name, Enrollment Date, Enrollments)

**Independent Test**: Click column headers and verify list re-sorts. Click same header twice to toggle ascending/descending. Verify arrow icons show current sort state.

### Implementation for User Story 2

- [ ] T019 [P] [US2] Create SortableTableHead component in contoso-university-ui/src/components/common/SortableTableHead.tsx
- [ ] T020 [US2] Add sort state to StudentList.tsx: sortBy, sortDirection (using useStudentListParams for URL sync)
- [ ] T021 [US2] Implement handleSort function in StudentList.tsx to toggle sort direction and update URL params
- [ ] T022 [US2] Replace existing TableHead elements with SortableTableHead components in StudentList.tsx table
- [ ] T023 [US2] Update fetchStudents function in StudentList.tsx to pass sortBy and sortDirection to API (if backend supports)
- [ ] T024 [US2] If backend doesn't support sorting: Implement client-side sorting with useMemo in StudentList.tsx
- [ ] T025 [US2] Synchronize sort state with URL query params in StudentList.tsx
- [ ] T026 [US2] Ensure search + sort work together (sorting applies to filtered results) in StudentList.tsx

**Checkpoint**: Column sorting fully functional - can sort by any column with visual indicators

---

## Phase 5: User Story 3 - Enhanced Action Buttons (Priority: P2)

**Goal**: Add confirmation dialog for delete action with accessibility features

**Independent Test**: Click Delete button, verify confirmation dialog shows student name. Test Cancel, Escape key, and Confirm actions. Verify keyboard navigation works.

### Implementation for User Story 3

- [ ] T027 [P] [US3] Create StudentDeleteDialog component in contoso-university-ui/src/components/features/StudentDeleteDialog.tsx
- [ ] T028 [US3] Add delete dialog state to StudentList.tsx: deleteDialog { isOpen, studentId, studentName }, isDeleting
- [ ] T029 [US3] Implement handleDeleteClick handler in StudentList.tsx to open dialog with student details
- [ ] T030 [US3] Implement handleDeleteConfirm handler in StudentList.tsx to call deleteStudent API and refresh list
- [ ] T031 [US3] Implement handleDeleteCancel handler in StudentList.tsx to close dialog
- [ ] T032 [US3] Update Delete button in StudentList.tsx to call handleDeleteClick instead of window.confirm
- [ ] T033 [US3] Add StudentDeleteDialog component to StudentList.tsx render (at end of component)
- [ ] T034 [US3] Handle edge case: If deleting last student on page, navigate to previous page in StudentList.tsx
- [ ] T035 [US3] Add loading state to delete button in StudentDeleteDialog (spinner during API call)
- [ ] T036 [US3] Verify ARIA labels on action buttons for screen reader accessibility in StudentList.tsx
- [ ] T037 [US3] Test keyboard navigation: Tab through buttons, Enter to activate, Escape to close dialog

**Checkpoint**: Delete confirmation dialog fully functional with accessibility support

---

## Phase 6: User Story 4 - Improved Pagination Experience (Priority: P2)

**Goal**: Enhance pagination with page number buttons, page jumping, and page size selector

**Independent Test**: Navigate using page numbers, first/last buttons, and change page size. Verify correct pages load and disabled states work.

### Implementation for User Story 4

- [ ] T038 [US4] Add getPageNumbers function to Pagination.tsx for ellipsis logic (show first, last, current ± 1 with ellipsis)
- [ ] T039 [US4] Add page size selector (Select component) to Pagination.tsx with options [10, 25, 50, 100]
- [ ] T040 [US4] Add onPageSizeChange prop and handler to Pagination.tsx
- [ ] T041 [US4] Add first page button (ChevronsLeft icon) to Pagination.tsx
- [ ] T042 [US4] Add last page button (ChevronsRight icon) to Pagination.tsx
- [ ] T043 [US4] Add page number buttons to Pagination.tsx (using getPageNumbers result)
- [ ] T044 [US4] Style current page button with variant="default", others with variant="outline" in Pagination.tsx
- [ ] T045 [US4] Update StudentList.tsx to pass onPageSizeChange handler to Pagination component
- [ ] T046 [US4] Implement handlePageSizeChange in StudentList.tsx to update URL params and reset to page 1
- [ ] T047 [US4] Synchronize pageSize with URL query params in StudentList.tsx
- [ ] T048 [US4] Update responsive layout in Pagination.tsx: stack controls on mobile, row on desktop

**Checkpoint**: Enhanced pagination fully functional with page jumping and size selection

---

## Phase 7: User Story 5 - Results Summary and Feedback (Priority: P3)

**Goal**: Display clear results summary showing current range, total count, and active filters

**Independent Test**: View results summary, apply filters, change pages, verify summary updates correctly showing range and filter status.

### Implementation for User Story 5

- [ ] T049 [US5] Calculate results range in StudentList.tsx: startIndex = (currentPage - 1) * pageSize + 1, endIndex = min(startIndex + students.length - 1, totalCount)
- [ ] T050 [US5] Update results summary text in StudentList.tsx to show "Showing {startIndex}-{endIndex} of {totalCount} students"
- [ ] T051 [US5] Add filtered indicator to results summary when search is active: "(filtered by '{searchTerm}')"
- [ ] T052 [US5] Show loading indicator in results area during data fetch in StudentList.tsx
- [ ] T053 [US5] Update results summary styling with text-sm and text-muted-foreground classes
- [ ] T054 [US5] Handle edge case: When totalCount is 0, show "No students found" instead of "Showing 0-0"

**Checkpoint**: Results summary fully functional with filter indicators

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

### Responsive Design & Accessibility

- [ ] T055 [P] Add responsive classes to table columns in StudentList.tsx: hide firstName on mobile (md:table-cell), hide enrollmentDate and enrollmentCount on mobile/tablet (lg:table-cell)
- [ ] T056 [P] Stack action buttons vertically on mobile in StudentList.tsx: flex-col sm:flex-row
- [ ] T057 [P] Add mobile-friendly layout: show firstName under lastName on small screens in StudentList.tsx
- [ ] T058 [P] Test keyboard navigation: Tab through all interactive elements, Enter/Space to activate
- [ ] T059 [P] Verify WCAG 2.1 AA compliance: focus indicators visible (3:1 contrast), ARIA labels present
- [ ] T060 [P] Test responsive breakpoints: 320px (mobile), 640px (tablet), 1024px (desktop)

### Performance Optimization

- [ ] T061 [P] Memoize StudentRow component with React.memo in StudentList.tsx
- [ ] T062 [P] Use useMemo for sorted/filtered student list in StudentList.tsx
- [ ] T063 [P] Use useCallback for event handlers passed to child components in StudentList.tsx
- [ ] T064 Verify debounce working: Only 1 API call after typing stops (400ms delay)
- [ ] T065 Test with 1000 students: Verify no lag, <500ms filter response time

### URL State Management

- [ ] T066 Initialize state from URL query params on mount in StudentList.tsx
- [ ] T067 Update URL when state changes: search, sort, page, pageSize
- [ ] T068 Test browser back/forward buttons: Verify state restores correctly
- [ ] T069 Test bookmarkability: Copy URL, paste in new tab, verify state restored

### Error Handling & Edge Cases

- [ ] T070 [P] Handle network failure during fetch: Show error message with retry button in StudentList.tsx
- [ ] T071 [P] Handle delete failure: Show error message, keep student in list in StudentList.tsx
- [ ] T072 [P] Handle invalid URL params: Apply defaults, no crash in useStudentListParams hook
- [ ] T073 [P] Handle rapid typing: Verify debounce cancels previous timers in useDebounce hook
- [ ] T074 [P] Handle empty search results: Show helpful message in StudentList.tsx
- [ ] T075 [P] Handle page out of bounds: Navigate to last valid page when pageSize changes

### Code Quality

- [ ] T076 [P] Add TypeScript types for all state and props in StudentList.tsx
- [ ] T077 [P] Add explanatory comments for educational value in all new components
- [ ] T078 [P] Remove any console.log statements and unused imports
- [ ] T079 [P] Verify consistent code style: Tailwind classes, component patterns
- [ ] T080 Run quickstart.md manual testing checklist: Search, Sort, Pagination, Delete, URL persistence, Accessibility, Responsive

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User Story 1 (Real-Time Search) - P1 priority
  - User Story 2 (Column Sorting) - P1 priority (can start after Foundational)
  - User Story 3 (Enhanced Action Buttons) - P2 priority (can start after Foundational)
  - User Story 4 (Improved Pagination) - P2 priority (can start after Foundational)
  - User Story 5 (Results Summary) - P3 priority (can start after Foundational)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational (Phase 2) - useDebounce, useStudentListParams hooks
- **User Story 2 (P1)**: Depends on Foundational (Phase 2) - useStudentListParams hook. Independent of US1.
- **User Story 3 (P2)**: Depends on Foundational (Phase 2) - No dependencies on other stories
- **User Story 4 (P2)**: Depends on Foundational (Phase 2) - usePagination hook. Independent of other stories.
- **User Story 5 (P3)**: Depends on US1 (search state) and US4 (pagination state) to display correct summary

### Within Each User Story

- US1: State → Handlers → UI updates → URL sync → Loading/empty states
- US2: Component creation (parallel) → State → Handlers → Table integration → URL sync
- US3: Component creation (parallel) → State → Handlers → Integration → Accessibility
- US4: Component enhancements → State → Handlers → Integration → Responsive
- US5: Calculations → UI updates → Edge cases

### Parallel Opportunities

- **Phase 1 (Setup)**: All verification tasks can run in parallel
- **Phase 2 (Foundational)**: T007 and T008 can run in parallel (different files)
- **Within User Stories**:
  - US2: T019 (component creation) can run parallel to T020 (state setup)
  - US3: T027 (component creation) can run parallel to T028-T031 (handlers)
  - All Polish tasks marked [P] can run in parallel (different concerns)

---

## Parallel Example: Foundational Phase

```bash
# These hooks can be created simultaneously by different developers:
Task: "Create useDebounce hook in contoso-university-ui/src/hooks/useDebounce.ts"
Task: "Create useStudentListParams hook in contoso-university-ui/src/hooks/useQueryParams.ts"
```

## Parallel Example: User Story 2

```bash
# Component and state can be developed in parallel:
Task: "Create SortableTableHead component in contoso-university-ui/src/components/common/SortableTableHead.tsx"
Task: "Add sort state to StudentList.tsx"
```

## Parallel Example: Polish Phase

```bash
# All polish tasks affect different aspects and can run in parallel:
Task: "Add responsive classes to table columns in StudentList.tsx"
Task: "Stack action buttons vertically on mobile in StudentList.tsx"
Task: "Memoize StudentRow component with React.memo"
Task: "Add TypeScript types for all state and props"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

Since both US1 and US2 are P1 priority, the MVP includes both:

1. Complete Phase 1: Setup (verify environment)
2. Complete Phase 2: Foundational (CRITICAL - create hooks)
3. Complete Phase 3: User Story 1 (real-time search)
4. Complete Phase 4: User Story 2 (column sorting)
5. **STOP and VALIDATE**: Test search + sort together
6. Deploy/demo if ready

**Value Delivered**: Administrators can quickly find and organize students - the two most common workflows.

### Incremental Delivery

1. **Foundation** (Phases 1-2) → Hooks ready
2. **MVP** (Phases 3-4) → Search + Sort working → Deploy/Demo
3. **Enhanced UX** (Phases 5-6) → Add delete dialog + pagination → Deploy/Demo
4. **Polish** (Phases 7-8) → Add summary + optimize → Deploy/Demo

Each delivery adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers (after Foundational phase completes):

1. **Team completes Setup + Foundational together** (required)
2. **Parallel execution** (once hooks are ready):
   - Developer A: User Story 1 (Search) - Tasks T010-T018
   - Developer B: User Story 2 (Sorting) - Tasks T019-T026
   - Developer C: User Story 3 (Delete Dialog) - Tasks T027-T037
3. Stories complete and integrate independently
4. Team reconvenes for Polish phase

---

## Task Summary

**Total Tasks**: 80
- **Phase 1 (Setup)**: 6 tasks
- **Phase 2 (Foundational)**: 3 tasks (BLOCKING)
- **Phase 3 (US1 - Search)**: 9 tasks
- **Phase 4 (US2 - Sorting)**: 8 tasks
- **Phase 5 (US3 - Delete Dialog)**: 11 tasks
- **Phase 6 (US4 - Pagination)**: 11 tasks
- **Phase 7 (US5 - Summary)**: 6 tasks
- **Phase 8 (Polish)**: 26 tasks

**Parallel Opportunities**: 27 tasks marked [P] can run in parallel within their phase

**Independent Stories**: US1, US2, US3, US4 are independently testable. US5 depends on US1 + US4 for state.

**Estimated Time** (from quickstart.md):
- Foundational: 30 min
- US1 (Search): 30 min
- US2 (Sorting): 45 min
- US3 (Delete): 30 min
- US4 (Pagination): 45 min
- US5 (Summary): 15 min
- Polish: 30 min
- **Total**: ~3-3.5 hours

**MVP Scope**: Phases 1-4 (Setup + Foundation + US1 + US2) = ~1.5 hours

---

## Notes

- [P] tasks = different files/concerns, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No automated tests (manual testing per project standards)
- Commit after each logical task group
- Stop at any checkpoint to validate story independently
- Follow quickstart.md for detailed code examples and troubleshooting
- Reference research.md for technical decision rationale
- Reference contracts/ui-components.md for component specifications

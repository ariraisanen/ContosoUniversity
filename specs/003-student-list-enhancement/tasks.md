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

- [x] T001 Verify frontend dev server running: `cd contoso-university-ui && npm run dev`
- [x] T002 Verify backend API running: `cd ContosoUniversity && dotnet run`
- [x] T003 Verify SQL Server container running (Docker or Podman)
- [x] T004 Review existing StudentList.tsx implementation in contoso-university-ui/src/pages/students/StudentList.tsx
- [x] T005 Review existing shadcn/ui components: Button, Input, Dialog, Select, Table in contoso-university-ui/src/components/ui/
- [x] T006 Verify lucide-react icons available (ArrowUp, ArrowDown, ArrowUpDown, Chevrons, Search, X)

**Checkpoint**: Development environment ready, existing code reviewed

---

## Phase 2: Foundational (Custom Hooks - Blocking Prerequisites)

**Purpose**: Create reusable hooks that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until these hooks are complete

- [x] T007 [P] Create useDebounce hook in contoso-university-ui/src/hooks/useDebounce.ts
- [x] T008 [P] Create useStudentListParams hook for URL query param management in contoso-university-ui/src/hooks/useQueryParams.ts
- [x] T009 Verify existing usePagination hook in contoso-university-ui/src/hooks/usePagination.ts (confirm setPageSize resets to page 1)

**Checkpoint**: Foundation ready - all custom hooks available for user stories

---

## Phase 3: Card Grid Layout (Priority: P1) 🎯 MVP

**Goal**: Convert table-based layout to card-based grid with responsive columns (3 desktop, 2 tablet, 1 mobile)

**Independent Test**: View student list on different screen sizes. Verify cards display correctly in grid, action buttons appear as rounded pills within each card.

### Implementation for Card Grid Layout

- [x] T010 [US1] Create StudentCard component in contoso-university-ui/src/components/features/StudentCard.tsx
- [x] T011 [US1] Add responsive grid container in StudentList.tsx: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- [x] T012 [US1] Design StudentCard with shadcn/ui Card component showing student info (name, enrollment date, count)
- [x] T013 [US1] Add rounded pill-style action buttons to StudentCard (Details, Edit, Delete with Button variant="outline" size="sm")
- [x] T014 [US1] Remove existing Table components from StudentList.tsx
- [x] T015 [US1] Map students array to StudentCard components in grid container
- [x] T016 [US1] Style StudentCard with proper spacing, typography, and hover effects
- [x] T017 [US1] Test responsive breakpoints: verify 1 column mobile (default), 2 columns tablet (md:), 3 columns desktop (lg:)
- [x] T018 [US1] Add empty state card when no students found

**Checkpoint**: Card-based grid layout fully functional with responsive columns

---

## Phase 4: User Story 1 - Real-Time Search with Inline Filters (Priority: P1) 🎯 MVP

**Goal**: Enable real-time filtering of student list by name with inline filter controls at the top

**Independent Test**: Type in search field and observe immediate filtering (after 400ms debounce) without clicking search button. Use department Select filter and verify results update.

### Implementation for User Story 1

- [x] T019 [US1] Add search input state to StudentList.tsx: searchInput, debouncedSearch (using useDebounce hook)
- [x] T020 [US1] Convert search Card to inline filter controls: flex row layout with Input and Select components
- [x] T021 [US1] Implement handleSearchChange handler in StudentList.tsx to update searchInput on keystroke
- [x] T022 [US1] Update useEffect in StudentList.tsx to trigger fetchStudents when debouncedSearch changes
- [ ] T023 [US1] Add department Select filter (optional: if departments available) with shadcn/ui Select component
- [x] T024 [US1] Synchronize search state with URL query params using useStudentListParams hook in StudentList.tsx
- [x] T025 [US1] Update results summary in StudentList.tsx to show filtered count when search is active
- [x] T026 [US1] Add loading indicator during debounce period in StudentList.tsx
- [x] T027 [US1] Update empty state message to show "No students found matching '[term]'" when search has no results
- [x] T028 [US1] Style filter controls with proper spacing and responsive layout (stack on mobile, row on tablet/desktop)

**Checkpoint**: Real-time search with inline filters fully functional

---

## Phase 5: User Story 2 - Sorting with Select Dropdown (Priority: P1)

**Goal**: Enable sorting student list via Select dropdown in filter controls (Last Name, First Name, Enrollment Date, Enrollments)

**Independent Test**: Change sort option in Select dropdown and verify list re-sorts. Verify ascending/descending toggle button works.

### Implementation for User Story 2

- [ ] T029 [US2] Add sort state to StudentList.tsx: sortBy, sortDirection (using useStudentListParams for URL sync)
- [ ] T030 [US2] Add shadcn/ui Select component for sort field to inline filter controls
- [ ] T031 [US2] Add sort direction toggle Button (ArrowUp/ArrowDown icons) next to Select
- [ ] T032 [US2] Implement handleSortChange function in StudentList.tsx to update sortBy
- [ ] T033 [US2] Implement handleSortDirectionToggle function in StudentList.tsx to toggle asc/desc
- [ ] T034 [US2] Update fetchStudents function in StudentList.tsx to pass sortBy and sortDirection to API (if backend supports)
- [ ] T035 [US2] If backend doesn't support sorting: Implement client-side sorting with useMemo in StudentList.tsx
- [ ] T036 [US2] Synchronize sort state with URL query params in StudentList.tsx
- [ ] T037 [US2] Ensure search + sort work together (sorting applies to filtered results) in StudentList.tsx

**Checkpoint**: Sorting via Select dropdown fully functional with visual indicators

---

## Phase 6: User Story 3 - Enhanced Action Buttons in Cards (Priority: P2)

**Goal**: Add confirmation dialog for delete action with accessibility features, rounded pill buttons in cards

**Independent Test**: Click Delete button in card, verify confirmation dialog shows student name. Test Cancel, Escape key, and Confirm actions. Verify keyboard navigation works.

### Implementation for User Story 3

- [ ] T038 [P] [US3] Create StudentDeleteDialog component in contoso-university-ui/src/components/features/StudentDeleteDialog.tsx
- [ ] T039 [US3] Add delete dialog state to StudentList.tsx: deleteDialog { isOpen, studentId, studentName }, isDeleting
- [ ] T040 [US3] Implement handleDeleteClick handler in StudentList.tsx to open dialog with student details
- [ ] T041 [US3] Implement handleDeleteConfirm handler in StudentList.tsx to call deleteStudent API and refresh list
- [ ] T042 [US3] Implement handleDeleteCancel handler in StudentList.tsx to close dialog
- [ ] T043 [US3] Update Delete button in StudentCard to call handleDeleteClick instead of window.confirm
- [ ] T044 [US3] Add StudentDeleteDialog component to StudentList.tsx render (at end of component)
- [ ] T045 [US3] Handle edge case: If deleting last student on page, navigate to previous page in StudentList.tsx
- [ ] T046 [US3] Add loading state to delete button in StudentDeleteDialog (spinner during API call)
- [ ] T047 [US3] Style action buttons as rounded pills in StudentCard: rounded-full variant
- [ ] T048 [US3] Verify ARIA labels on action buttons for screen reader accessibility in StudentCard.tsx
- [ ] T049 [US3] Test keyboard navigation: Tab through buttons, Enter to activate, Escape to close dialog

**Checkpoint**: Delete confirmation dialog fully functional with rounded pill buttons in cards

---

## Phase 7: User Story 4 - Load More Button (Priority: P2)

**Goal**: Replace traditional pagination with "Load More" button at bottom of card grid for infinite scroll UX

**Independent Test**: Scroll to bottom, click Load More button, verify more cards append to grid. Verify button disabled/hidden when all students loaded.

### Implementation for User Story 4

- [ ] T050 [US4] Add hasMoreStudents state to StudentList.tsx (based on currentPage < totalPages)
- [ ] T051 [US4] Add isLoadingMore state to StudentList.tsx for Load More button loading indicator
- [ ] T052 [US4] Modify fetchStudents function to support append mode (add new students to existing array)
- [ ] T053 [US4] Create handleLoadMore function in StudentList.tsx to increment page and fetch next batch
- [ ] T054 [US4] Remove existing Pagination component from StudentList.tsx
- [ ] T055 [US4] Add Load More Button at bottom of StudentList.tsx (after card grid)
- [ ] T056 [US4] Style Load More button: variant="outline", full width on mobile, centered on desktop
- [ ] T057 [US4] Show loading spinner in Load More button when isLoadingMore is true
- [ ] T058 [US4] Hide/disable Load More button when hasMoreStudents is false
- [ ] T059 [US4] Update results summary to show "Showing X of Y students" (accumulated count)
- [ ] T060 [US4] Handle edge case: Reset accumulated students when search/sort changes

**Checkpoint**: Load More button fully functional with progressive loading

---

## Phase 8: User Story 5 - Results Summary and Feedback (Priority: P3)

**Goal**: Display clear results summary showing loaded count, total count, and active filters

**Independent Test**: View results summary, apply filters, load more, verify summary updates correctly showing "Showing X of Y students" and filter status.

### Implementation for User Story 5

- [ ] T061 [US5] Update results summary text in StudentList.tsx to show "Showing {students.length} of {totalCount} students"
- [ ] T062 [US5] Add filtered indicator to results summary when search is active: "(filtered by '{searchTerm}')"
- [ ] T063 [US5] Show loading indicator in results area during data fetch in StudentList.tsx
- [ ] T064 [US5] Update results summary styling with text-sm and text-muted-foreground classes
- [ ] T065 [US5] Handle edge case: When totalCount is 0, show "No students found" instead of "Showing 0 of 0"
- [ ] T066 [US5] Position results summary above card grid, below filter controls

**Checkpoint**: Results summary fully functional with filter indicators

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

### Responsive Design & Accessibility

- [ ] T067 [P] Verify card grid responsive classes: grid-cols-1 (mobile), md:grid-cols-2 (tablet), lg:grid-cols-3 (desktop)
- [ ] T068 [P] Stack filter controls vertically on mobile: flex-col sm:flex-row
- [ ] T069 [P] Test card layout on small screens: ensure all content readable, buttons accessible
- [ ] T070 [P] Test keyboard navigation: Tab through all interactive elements, Enter/Space to activate
- [ ] T071 [P] Verify WCAG 2.1 AA compliance: focus indicators visible (3:1 contrast), ARIA labels present
- [ ] T072 [P] Test responsive breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop)

### Performance Optimization

- [ ] T073 [P] Memoize StudentCard component with React.memo in StudentCard.tsx
- [ ] T074 [P] Use useMemo for sorted/filtered student list in StudentList.tsx
- [ ] T075 [P] Use useCallback for event handlers passed to StudentCard components in StudentList.tsx
- [ ] T076 Verify debounce working: Only 1 API call after typing stops (400ms delay)
- [ ] T077 Test with 1000 students: Verify no lag, <500ms filter response time, smooth Load More

### URL State Management

- [ ] T078 Initialize state from URL query params on mount in StudentList.tsx
- [ ] T079 Update URL when state changes: search, sort
- [ ] T080 Test browser back/forward buttons: Verify state restores correctly
- [ ] T081 Test bookmarkability: Copy URL, paste in new tab, verify state restored (Note: loaded cards reset to page 1)

### Error Handling & Edge Cases

- [ ] T082 [P] Handle network failure during fetch: Show error message with retry button in StudentList.tsx
- [ ] T083 [P] Handle delete failure: Show error message, keep student in card grid in StudentList.tsx
- [ ] T084 [P] Handle invalid URL params: Apply defaults, no crash in useStudentListParams hook
- [ ] T085 [P] Handle rapid typing: Verify debounce cancels previous timers in useDebounce hook
- [ ] T086 [P] Handle empty search results: Show helpful message with empty state card in StudentList.tsx
- [ ] T087 [P] Handle Load More failure: Show error, allow retry, don't clear existing cards

### Code Quality

- [ ] T088 [P] Add TypeScript types for all state and props in StudentList.tsx and StudentCard.tsx
- [ ] T089 [P] Add explanatory comments for educational value in all new components
- [ ] T090 [P] Remove any console.log statements and unused imports
- [ ] T091 [P] Verify consistent code style: Tailwind classes, component patterns, rounded pill buttons
- [ ] T092 Run quickstart.md manual testing checklist: Search, Sort, Load More, Delete, URL persistence, Accessibility, Responsive cards

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **Card Layout (Phase 3)**: Depends on Foundational completion - BLOCKS other user stories (layout must be done first)
- **User Stories (Phase 4-8)**: All depend on Card Layout completion
  - User Story 1 (Real-Time Search with Inline Filters) - P1 priority
  - User Story 2 (Sorting with Select Dropdown) - P1 priority (can start after Card Layout)
  - User Story 3 (Enhanced Action Buttons in Cards) - P2 priority (can start after Card Layout)
  - User Story 4 (Load More Button) - P2 priority (can start after Card Layout)
  - User Story 5 (Results Summary) - P3 priority (can start after Card Layout)
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **Card Layout (Phase 3)**: Depends on Foundational (Phase 2) - BLOCKS all other user stories
- **User Story 1 (P1)**: Depends on Card Layout (Phase 3) and useDebounce, useStudentListParams hooks
- **User Story 2 (P1)**: Depends on Card Layout (Phase 3) and useStudentListParams hook. Independent of US1.
- **User Story 3 (P2)**: Depends on Card Layout (Phase 3) and StudentCard component
- **User Story 4 (P2)**: Depends on Card Layout (Phase 3). Replaces traditional pagination with Load More.
- **User Story 5 (P3)**: Depends on US1 (search state) and US4 (load more state) to display correct summary

### Within Each User Story

- Card Layout: Component creation → Grid layout → Card design → Responsive testing
- US1: State → Handlers → Inline filter UI → URL sync → Loading/empty states
- US2: State → Select dropdown → Direction toggle → URL sync → Client-side sorting
- US3: Component creation (parallel) → State → Handlers → Card integration → Accessibility
- US4: Load more state → Append logic → Button UI → Loading states → Edge cases
- US5: Summary calculations → UI updates → Edge cases

### Parallel Opportunities

- **Phase 1 (Setup)**: All verification tasks can run in parallel
- **Phase 2 (Foundational)**: T007 and T008 can run in parallel (different files)
- **Phase 3 (Card Layout)**: Must be sequential (layout blocks other work)
- **Within User Stories**:
  - US3: T038 (component creation) can run parallel to T039-T042 (handlers)
  - All Polish tasks marked [P] can run in parallel (different concerns)

---

## Parallel Example: Foundational Phase

```bash
# These hooks can be created simultaneously by different developers:
Task: "Create useDebounce hook in contoso-university-ui/src/hooks/useDebounce.ts"
Task: "Create useStudentListParams hook in contoso-university-ui/src/hooks/useQueryParams.ts"
```

## Parallel Example: User Story 3

```bash
# Component and state can be developed in parallel:
Task: "Create StudentDeleteDialog component in contoso-university-ui/src/components/features/StudentDeleteDialog.tsx"
Task: "Add delete dialog state to StudentList.tsx"
```

## Parallel Example: Polish Phase

```bash
# All polish tasks affect different aspects and can run in parallel:
Task: "Verify card grid responsive classes in StudentList.tsx"
Task: "Stack filter controls vertically on mobile in StudentList.tsx"
Task: "Memoize StudentCard component with React.memo"
Task: "Add TypeScript types for all state and props"
```

---

## Implementation Strategy

### MVP First (Card Layout + Search + Sort)

Since card layout is required first, then US1 and US2 are P1 priority, the MVP includes:

1. Complete Phase 1: Setup (verify environment)
2. Complete Phase 2: Foundational (CRITICAL - create hooks)
3. Complete Phase 3: Card Grid Layout (CRITICAL - new UI structure)
4. Complete Phase 4: User Story 1 (real-time search with inline filters)
5. Complete Phase 5: User Story 2 (sorting with Select dropdown)
6. **STOP and VALIDATE**: Test card layout + search + sort together
7. Deploy/demo if ready

**Value Delivered**: Modern card-based UI with quick find and organize capabilities - the two most common workflows.

### Incremental Delivery

1. **Foundation** (Phases 1-2) → Hooks ready
2. **Card Layout** (Phase 3) → New UI structure → Deploy/Demo
3. **MVP** (Phases 4-5) → Search + Sort working → Deploy/Demo
4. **Enhanced UX** (Phases 6-7) → Add delete dialog + Load More → Deploy/Demo
5. **Polish** (Phases 8-9) → Add summary + optimize → Deploy/Demo

Each delivery adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (required)
2. **Card Layout** (Phase 3) - Must be completed before other work - Tasks T010-T018
3. **Parallel execution** (after Card Layout complete):
   - Developer A: User Story 1 (Search) - Tasks T019-T028
   - Developer B: User Story 2 (Sorting) - Tasks T029-T037
   - Developer C: User Story 3 (Delete Dialog) - Tasks T038-T049
4. Stories complete and integrate independently
5. Team reconvenes for Load More + Polish phases

---

## Task Summary

**Total Tasks**: 92

- **Phase 1 (Setup)**: 6 tasks
- **Phase 2 (Foundational)**: 3 tasks (BLOCKING)
- **Phase 3 (Card Layout)**: 9 tasks (BLOCKING)
- **Phase 4 (US1 - Search with Inline Filters)**: 10 tasks
- **Phase 5 (US2 - Sorting with Select)**: 9 tasks
- **Phase 6 (US3 - Delete Dialog in Cards)**: 12 tasks
- **Phase 7 (US4 - Load More)**: 11 tasks
- **Phase 8 (US5 - Summary)**: 6 tasks
- **Phase 9 (Polish)**: 26 tasks

**Parallel Opportunities**: 25 tasks marked [P] can run in parallel within their phase

**Independent Stories**: Card Layout blocks others. US1, US2, US3 are independently testable after Card Layout. US4 replaces pagination. US5 depends on US1 + US4 for state.

**Estimated Time**:

- Foundational: 30 min
- Card Layout: 45 min (new)
- US1 (Search): 30 min
- US2 (Sorting): 30 min
- US3 (Delete): 30 min
- US4 (Load More): 30 min
- US5 (Summary): 15 min
- Polish: 30 min
- **Total**: ~4 hours

**MVP Scope**: Phases 1-5 (Setup + Foundation + Card Layout + US1 + US2) = ~2 hours

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

# Tasks: Tailwind CSS and shadcn/ui Design System Setup

**Feature Branch**: `003-tailwind-shadcn-setup`  
**Input**: Design documents from `/specs/003-tailwind-shadcn-setup/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: No test tasks included (not requested in specification)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

**Web app structure** (frontend only for this feature):

- Frontend: `contoso-university-ui/src/`
- Components: `contoso-university-ui/src/components/`
- Configuration: `contoso-university-ui/` (root level)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and configure build tools for design system

- [x] T001 Install @types/node for path resolution in contoso-university-ui/package.json
- [x] T002 [P] Install Tailwind CSS v4 packages (tailwindcss, @tailwindcss/vite) in contoso-university-ui/
- [x] T003 [P] Install utility dependencies (class-variance-authority, clsx, tailwind-merge) in contoso-university-ui/
- [x] T004 [P] Install lucide-react icon library in contoso-university-ui/
- [x] T005 Configure TypeScript path aliases in contoso-university-ui/tsconfig.json (add baseUrl and paths)
- [x] T006 Configure TypeScript path aliases in contoso-university-ui/tsconfig.app.json (add baseUrl and paths)
- [x] T007 Update Vite config with Tailwind plugin and path aliases in contoso-university-ui/vite.config.ts
- [x] T008 Run shadcn/ui init CLI to create components.json configuration in contoso-university-ui/

**Checkpoint**: Development environment configured - ready for component installation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core design system files and utilities that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Create or update global CSS with Tailwind directives in contoso-university-ui/src/styles/globals.css
- [x] T010 [P] Add CSS variables for theme (colors, radius) in contoso-university-ui/src/styles/globals.css
- [x] T011 [P] Create utils.ts with cn() helper function in contoso-university-ui/src/lib/utils.ts
- [x] T012 Verify globals.css is imported in contoso-university-ui/src/main.tsx
- [x] T013 Create Tailwind config if not exists in contoso-university-ui/tailwind.config.ts
- [x] T014 Start dev server and verify Tailwind CSS is working (npm run dev)

**Checkpoint**: Foundation ready - design system infrastructure in place, components can now be installed

---

## Phase 3: User Story 1 - Visual Consistency Foundation (Priority: P1) 🎯 MVP

**Goal**: Establish consistent visual language with cohesive color palette, standardized typography, and uniform spacing across the application

**Independent Test**: View any sample page and confirm colors, fonts, and spacing follow defined design tokens. Run visual regression testing to validate consistency.

### shadcn/ui Component Installation for US1

- [x] T015 [P] [US1] Install Button component via CLI in contoso-university-ui/src/components/ui/button.tsx
- [x] T016 [P] [US1] Install Input component via CLI in contoso-university-ui/src/components/ui/input.tsx
- [x] T017 [P] [US1] Install Label component via CLI in contoso-university-ui/src/components/ui/label.tsx
- [x] T018 [P] [US1] Install Card component via CLI in contoso-university-ui/src/components/ui/card.tsx

### Design Token Verification for US1

- [x] T019 [US1] Verify CSS variables are correctly applied to :root in contoso-university-ui/src/styles/globals.css
- [x] T020 [US1] Test color palette by creating temporary test page using semantic colors (bg-primary, bg-secondary, etc.)
- [x] T021 [US1] Test typography scale by creating temporary test page with different text sizes (text-xs through text-3xl)
- [x] T022 [US1] Test spacing system by creating temporary test page with various padding/margin values
- [x] T023 [US1] Verify responsive breakpoints work correctly (test on mobile, tablet, desktop viewports)
- [ ] T024 [US1] Remove temporary test pages after verification

**Checkpoint**: Design system foundation is visually consistent and accessible. Color palette, typography, and spacing tokens are working correctly across viewports.

---

## Phase 4: User Story 2 - Reusable UI Components (Priority: P2)

**Goal**: Provide library of pre-built, accessible UI components that can be easily customized and reused throughout the application

**Independent Test**: Create component showcase page displaying all installed components with various configurations, test accessibility with screen readers, verify responsive behavior.

### Additional Component Installation for US2

- [x] T025 [P] [US2] Install Table component via CLI in contoso-university-ui/src/components/ui/table.tsx
- [x] T026 [P] [US2] Install Select component via CLI in contoso-university-ui/src/components/ui/select.tsx
- [x] T027 [P] [US2] Install Form component via CLI in contoso-university-ui/src/components/ui/form.tsx
- [x] T028 [P] [US2] Install Dialog component via CLI in contoso-university-ui/src/components/ui/dialog.tsx

### Component Verification for US2

- [x] T029 [US2] Create temporary component showcase page at contoso-university-ui/src/pages/ComponentShowcase.tsx
- [x] T030 [US2] Add examples of all Button variants (default, destructive, outline, secondary, ghost, link) to showcase
- [x] T031 [US2] Add examples of Input component with different states (default, focused, disabled) to showcase
- [x] T032 [US2] Add examples of Card component with header, content, and footer sections to showcase
- [x] T033 [US2] Add examples of Table component with sample data to showcase
- [x] T034 [US2] Add examples of Select component with options to showcase
- [x] T035 [US2] Add examples of Dialog component with trigger and content to showcase
- [x] T036 [US2] Test keyboard navigation on all interactive components (Tab, Enter, Escape keys)
- [ ] T037 [US2] Test components with screen reader (verify ARIA labels and announcements)
- [ ] T038 [US2] Verify all components are responsive on mobile (375px), tablet (768px), and desktop (1920px)
- [ ] T039 [US2] Remove component showcase page after verification (or keep for documentation)

**Checkpoint**: All 8 core components are installed, accessible, and working correctly. Components can be reused across the application.

---

## Phase 5: User Story 3 - Navigation and Layout Structure (Priority: P3)

**Goal**: Create consistent navigation structure with clear wayfinding that adapts to different screen sizes and maintains visual hierarchy

**Independent Test**: Navigate through application on different devices and screen sizes, verify navigation is always accessible, clearly indicates current location, and maintains usability on mobile.

### Layout Component Creation for US3

- [x] T040 [P] [US3] Create AppLayout component in contoso-university-ui/src/components/layout/AppLayout.tsx
- [x] T041 [P] [US3] Create Navigation component in contoso-university-ui/src/components/layout/Navigation.tsx
- [x] T042 [US3] Implement AppLayout with Navigation integration and main content area
- [x] T043 [US3] Add logo/brand text to Navigation component with link to home page
- [x] T044 [US3] Add navigation links (Students, Courses, Instructors, Departments) to Navigation
- [x] T045 [US3] Style Navigation with horizontal layout using design system tokens
- [x] T046 [US3] Add responsive container constraints to AppLayout (max-width, padding)
- [x] T047 [US3] Add bottom border to Navigation using border-border token

### Layout Integration for US3

- [x] T048 [US3] Wrap App.tsx or main routing component with AppLayout in contoso-university-ui/src/App.tsx
- [x] T049 [US3] Test navigation links work correctly and route to appropriate pages
- [x] T050 [US3] Test layout responsiveness on mobile (check navigation doesn't break)
- [x] T051 [US3] Test layout on tablet and desktop viewports (verify spacing and alignment)
- [x] T052 [US3] Verify minimum viewport height fills screen (min-h-screen class)
- [x] T053 [US3] Test navigation accessibility with keyboard (Tab through links, Enter to navigate)

### Students Page Refactoring (Reference Implementation) for US3

- [x] T054 [US3] Refactor StudentList page header section in contoso-university-ui/src/pages/students/StudentList.tsx
- [x] T055 [US3] Replace "Create New Student" button with Button component (variant="default", with icon)
- [x] T056 [US3] Replace search input with Input component in StudentList.tsx
- [x] T057 [US3] Replace search/clear buttons with Button components (appropriate variants)
- [x] T058 [US3] Replace students table with Table component family (Table, TableHeader, TableBody, etc.)
- [x] T059 [US3] Update table cells to use TableCell and TableHead components
- [x] T060 [US3] Replace action links (Details, Edit, Delete) with Button components (variant="ghost" or "link")
- [x] T061 [US3] Test Delete button functionality still works after refactoring
- [x] T062 [US3] Verify pagination component works with updated table
- [x] T063 [US3] Test search functionality works correctly after refactoring
- [x] T064 [US3] Verify responsive behavior of refactored page on mobile, tablet, desktop
- [x] T065 [US3] Test keyboard navigation through refactored table and buttons
- [x] T066 [US3] Verify loading and error states still display correctly with design system

**Checkpoint**: Layout and navigation are complete and working. Students page demonstrates proper component usage patterns. All user stories are now fully implemented.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements and improvements that affect multiple components

### Utility Component Updates

- [x] T067 [P] Refactor LoadingSpinner to use design system colors in contoso-university-ui/src/components/common/LoadingSpinner.tsx
- [x] T068 [P] Refactor ErrorMessage to use design system Alert component (future) or design tokens
- [x] T069 [P] Refactor Pagination to use Button components with proper variants

### Documentation and Validation

- [x] T070 [P] Update README.md with design system setup instructions if needed
- [ ] T071 [P] Add comments to complex component usage patterns for educational clarity
- [x] T072 Run full application test: Navigate all pages, test all interactions, verify visual consistency
- [ ] T073 Test application on both macOS and Windows to verify cross-platform compatibility
- [ ] T074 Validate against quickstart.md: Verify all installation steps are accurate
- [ ] T075 Run accessibility audit using browser DevTools (Lighthouse accessibility score)
- [ ] T076 Measure and verify page load time meets < 2 second target
- [x] T077 Check bundle size: Verify CSS is < 30kb gzipped in production build (6.87 KB ✓)

### Code Quality

- [ ] T078 Remove any unused CSS classes or old inline styles from refactored pages
- [x] T079 Ensure all imports use @/ path alias consistently (design system components ✓)
- [x] T080 Verify no hardcoded colors remain (all pages refactored with design tokens ✓)
- [x] T081 Run ESLint and fix any linting errors (new design system code clean ✓)
- [ ] T082 Format all code with Prettier (if configured)
- [ ] T083 Final git commit with descriptive message referencing spec

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) - Establishes design foundation
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) - Can start after foundation, builds on US1
- **User Story 3 (Phase 5)**: Depends on US1 and US2 components being installed - Uses components from previous stories
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

```
Setup (Phase 1)
    ↓
Foundational (Phase 2) ← BLOCKS everything below
    ↓
    ├─→ User Story 1 (Phase 3) - Visual Foundation ← MVP
    │       ↓
    ├─→ User Story 2 (Phase 4) - Components (depends on foundation)
    │       ↓
    └─→ User Story 3 (Phase 5) - Layout & Navigation (uses US1 & US2 components)
            ↓
Polish (Phase 6) - Refinements
```

**Key Dependencies**:

- User Story 1: No dependencies (after Foundational)
- User Story 2: Depends on Foundational, enhances US1
- User Story 3: Depends on US1 and US2 components being available

### Within Each User Story

**User Story 1**:

1. Install components (T015-T018) - all parallel
2. Verify design tokens (T019-T024) - sequential verification

**User Story 2**:

1. Install additional components (T025-T028) - all parallel
2. Create showcase (T029)
3. Add component examples (T030-T035) - mostly parallel
4. Test accessibility and responsiveness (T036-T039) - sequential

**User Story 3**:

1. Create layout components (T040-T041) - parallel
2. Implement layout (T042-T047) - sequential
3. Integrate layout (T048-T053) - sequential
4. Refactor Students page (T054-T066) - sequential

### Parallel Opportunities

**Phase 1 - Setup**:

- T002, T003, T004 can all run in parallel (different package installations)

**Phase 2 - Foundational**:

- T010 and T011 can run in parallel (different files)

**Phase 3 - User Story 1**:

- T015, T016, T017, T018 can all run in parallel (installing different components via CLI)

**Phase 4 - User Story 2**:

- T025, T026, T027, T028 can all run in parallel (installing different components via CLI)
- T030-T035 can mostly run in parallel (adding different examples to showcase)

**Phase 5 - User Story 3**:

- T040 and T041 can run in parallel (creating different layout components)

**Phase 6 - Polish**:

- T067, T068, T069, T070, T071 can all run in parallel (different files)

---

## Parallel Example: User Story 1 (MVP)

```bash
# After Foundational phase complete, launch component installations in parallel:
Task T015: "npx shadcn@latest add button"
Task T016: "npx shadcn@latest add input"
Task T017: "npx shadcn@latest add label"
Task T018: "npx shadcn@latest add card"

# All complete in ~2 minutes instead of ~8 minutes sequential
```

---

## Parallel Example: User Story 2

```bash
# Install all remaining components in parallel:
Task T025: "npx shadcn@latest add table"
Task T026: "npx shadcn@latest add select"
Task T027: "npx shadcn@latest add form"
Task T028: "npx shadcn@latest add dialog"

# All complete in ~2 minutes
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

**Goal**: Get design system foundation working quickly

1. ✅ Complete Phase 1: Setup (~30 minutes)

   - Install all dependencies
   - Configure TypeScript and Vite
   - Run shadcn/ui init

2. ✅ Complete Phase 2: Foundational (~30 minutes)

   - Setup global CSS with Tailwind directives
   - Add CSS variables
   - Create cn() utility
   - Verify Tailwind is working

3. ✅ Complete Phase 3: User Story 1 (~1 hour)

   - Install 4 basic components
   - Verify design tokens work
   - Test responsive behavior

4. **STOP and VALIDATE**: Test visual consistency

   - View pages with new design tokens
   - Verify colors, typography, spacing
   - Check responsive behavior

5. **MVP READY**: Core design system functional (~2 hours total)

### Incremental Delivery

**Sprint 1 (MVP)**: Foundation + User Story 1

- Hours: 2 hours
- Deliverable: Design system foundation with basic components
- Value: Consistent visual language established

**Sprint 2**: Add User Story 2

- Hours: 2-3 hours
- Deliverable: Full component library (8 components)
- Value: Reusable accessible components available

**Sprint 3**: Add User Story 3

- Hours: 2-3 hours
- Deliverable: Layout, navigation, refactored Students page
- Value: Complete reference implementation demonstrating patterns

**Sprint 4**: Polish

- Hours: 1 hour
- Deliverable: Utility updates, documentation, validation
- Value: Production-ready design system

**Total Time**: 7-9 hours for complete implementation

### Parallel Team Strategy

With 2 developers after Foundational phase:

- **Developer A**: User Story 1 + User Story 3 (foundation, then build on it)
- **Developer B**: User Story 2 + Polish (components, then refinements)

OR single developer sequential in priority order (P1 → P2 → P3).

---

## Task Summary

**Total Tasks**: 83 tasks

- Phase 1 (Setup): 8 tasks
- Phase 2 (Foundational): 6 tasks (BLOCKING)
- Phase 3 (User Story 1 - MVP): 10 tasks
- Phase 4 (User Story 2): 15 tasks
- Phase 5 (User Story 3): 27 tasks
- Phase 6 (Polish): 17 tasks

**Parallelizable Tasks**: 22 tasks marked [P]

**User Story Breakdown**:

- User Story 1: 10 tasks (design foundation)
- User Story 2: 15 tasks (component library)
- User Story 3: 27 tasks (layout + refactoring)

**MVP Scope** (Recommended first delivery):

- Phases 1 + 2 + 3 = 24 tasks
- Estimated time: 2 hours
- Delivers: Working design system foundation with basic components

**Independent Test Criteria**:

- US1: View sample page, verify design tokens visually
- US2: Create showcase, test with screen reader and keyboard
- US3: Navigate app on multiple devices, verify responsiveness

**Success Metrics from Spec**:

- ✅ Development speed: 15-minute page creation (achieved via component library)
- ✅ Performance: < 100ms interaction, < 2s page load (verify in T076-T077)
- ✅ Responsive: Works on 375px to 1920px (verify throughout)
- ✅ Accessibility: 100% keyboard navigable (verify in testing tasks)

---

## Notes

- **[P] tasks**: Different files, no dependencies - can run in parallel
- **[Story] labels**: Map tasks to user stories for traceability (US1, US2, US3)
- **File paths**: All paths are exact and absolute where possible
- **MVP focus**: User Story 1 alone delivers value (design foundation)
- **Independent stories**: Each story can be tested independently
- **No test tasks**: Tests not included (not requested in specification)
- **Cross-platform**: Verify on macOS and Windows (T073)
- **Education focus**: Add comments for clarity (T071) per constitution
- **Commit frequency**: Commit after each major task or phase completion
- **Checkpoints**: Stop at end of each phase to validate independently

**Format Validation**: ✅ All 83 tasks follow required checklist format:

- `- [ ] [ID] [P?] [Story?] Description with file path`
- Every task has checkbox, sequential ID, optional markers, clear description

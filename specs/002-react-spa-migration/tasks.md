# Tasks: React SPA Migration with REST API Backend

**Input**: Design documents from `/specs/002-react-spa-migration/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/openapi.yaml ✅

**Tests**: Not included in this migration phase (manual testing via Swagger UI and browser)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US5)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `ContosoUniversity/` (existing project)
- **Frontend**: `contoso-university-ui/` (new React app)
- Tasks use absolute paths from repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for both backend API and frontend SPA

- [x] T001 Install Swashbuckle.AspNetCore NuGet package in ContosoUniversity/ContosoUniversity.csproj
- [x] T002 [P] Create DTOs directory ContosoUniversity/DTOs/ with base files
- [x] T003 [P] Create Services directory ContosoUniversity/Services/ with interface folder
- [x] T004 [P] Create Middleware directory ContosoUniversity/Middleware/
- [x] T005 [P] Create Controllers directory ContosoUniversity/Controllers/
- [x] T006 Configure CORS policy in ContosoUniversity/Program.cs (AllowReactApp policy)
- [x] T007 Configure Swagger/OpenAPI in ContosoUniversity/Program.cs with XML comments
- [x] T008 Add GenerateDocumentationFile property to ContosoUniversity/ContosoUniversity.csproj
- [x] T009 Create frontend React TypeScript project using Vite: npm create vite@latest contoso-university-ui -- --template react-ts
- [x] T010 [P] Install frontend dependencies in contoso-university-ui/: axios, react-router-dom
- [x] T011 [P] Create frontend directory structure: src/components/, src/pages/, src/services/, src/types/, src/hooks/, src/context/
- [x] T012 Configure frontend environment variables in contoso-university-ui/.env with VITE_API_URL

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T013 Create PaginatedResponseDto<T> in ContosoUniversity/DTOs/PaginatedResponseDto.cs
- [x] T014 [P] Create ErrorResponseDto in ContosoUniversity/DTOs/ErrorResponseDto.cs
- [x] T015 Implement ErrorHandlingMiddleware in ContosoUniversity/Middleware/ErrorHandlingMiddleware.cs with ProblemDetails support
- [x] T016 Register ErrorHandlingMiddleware in ContosoUniversity/Program.cs pipeline
- [x] T017 [P] Create base API client in contoso-university-ui/src/services/api/client.ts with Axios interceptors
- [x] T018 [P] Create TypeScript interfaces for PaginatedResponse<T> and ErrorResponse in contoso-university-ui/src/types/api.ts
- [x] T019 [P] Create NotificationContext in contoso-university-ui/src/context/NotificationContext.tsx for error/success messages
- [x] T020 [P] Create common UI components: LoadingSpinner, ErrorMessage in contoso-university-ui/src/components/common/
- [x] T021 [P] Create Pagination component in contoso-university-ui/src/components/common/Pagination.tsx
- [x] T022 Setup React Router in contoso-university-ui/src/App.tsx with route structure
- [x] T023 [P] Create NavigationBar component in contoso-university-ui/src/components/common/NavigationBar.tsx
- [x] T024 [P] Create custom hooks: usePagination in contoso-university-ui/src/hooks/usePagination.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Student Management (Priority: P1) 🎯 MVP

**Goal**: Complete CRUD operations for students with pagination, form validation, and optimistic locking

**Independent Test**: Navigate to /students, create/read/update/delete students, test pagination, verify concurrency handling

### Backend Implementation for User Story 1

- [x] T025 [P] [US1] Create StudentDto in ContosoUniversity/DTOs/StudentDto.cs with validation attributes
- [x] T026 [P] [US1] Create CreateStudentDto in ContosoUniversity/DTOs/CreateStudentDto.cs
- [x] T027 [P] [US1] Create UpdateStudentDto in ContosoUniversity/DTOs/UpdateStudentDto.cs with RowVersion
- [x] T028 [US1] Create StudentMappings extension methods in ContosoUniversity/DTOs/StudentDto.cs (ToDto, UpdateFromDto)
- [x] T029 [US1] Create IStudentService interface in ContosoUniversity/Services/IStudentService.cs
- [x] T030 [US1] Implement StudentService in ContosoUniversity/Services/StudentService.cs with EF Core direct access
- [x] T031 [US1] Register StudentService in ContosoUniversity/Program.cs DI container
- [x] T032 [US1] Create StudentsController in ContosoUniversity/Controllers/StudentsController.cs with [ApiController] attribute
- [x] T033 [US1] Implement GET /api/students endpoint with pagination in StudentsController
- [x] T034 [US1] Implement GET /api/students/{id} endpoint in StudentsController
- [x] T035 [US1] Implement POST /api/students endpoint with 201 Created response in StudentsController
- [x] T036 [US1] Implement PUT /api/students/{id} endpoint with concurrency handling in StudentsController
- [x] T037 [US1] Implement DELETE /api/students/{id} endpoint with enrollment check in StudentsController
- [x] T038 [US1] Add XML documentation comments to all StudentsController endpoints

### Frontend Implementation for User Story 1

- [x] T039 [P] [US1] Create Student TypeScript interface in contoso-university-ui/src/types/student.ts
- [x] T040 [P] [US1] Create students API client in contoso-university-ui/src/services/api/studentService.ts (getAll, getById, create, update, delete)
- [x] T041 [P] [US1] Create StudentForm component in contoso-university-ui/src/components/features/StudentForm.tsx with validation
- [x] T042 [US1] Create StudentList page in contoso-university-ui/src/pages/students/StudentList.tsx
- [x] T043 [US1] Create CreateStudent page in contoso-university-ui/src/pages/students/CreateStudent.tsx
- [x] T044 [US1] Create EditStudent page in contoso-university-ui/src/pages/students/EditStudent.tsx with concurrency handling
- [x] T045 [US1] Create StudentDetails page in contoso-university-ui/src/pages/students/StudentDetails.tsx
- [x] T046 [US1] Add student routes to contoso-university-ui/src/App.tsx (/students, /students/create, /students/:id, /students/:id/edit)
- [x] T047 [US1] Create NotificationDisplay component in contoso-university-ui/src/components/common/NotificationDisplay.tsx

**Checkpoint**: Students CRUD fully functional - can create, read, update, delete students with proper validation and concurrency handling

---

## Phase 4: User Story 2 - Course Management (Priority: P1)

**Goal**: Complete CRUD operations for courses with department relationships and enrollment tracking

**Independent Test**: Navigate to /courses, create/read/update/delete courses, filter by department, verify enrollment count display

### Backend Implementation for User Story 2

- [ ] T052 [P] [US2] Create CourseDto in ContosoUniversity/DTOs/CourseDto.cs with DepartmentName and EnrollmentCount
- [ ] T053 [P] [US2] Create CreateCourseDto in ContosoUniversity/DTOs/CreateCourseDto.cs
- [ ] T054 [P] [US2] Create UpdateCourseDto in ContosoUniversity/DTOs/UpdateCourseDto.cs with RowVersion
- [ ] T055 [US2] Create CourseMappings extension methods in ContosoUniversity/DTOs/CourseDto.cs
- [ ] T056 [US2] Create ICourseService interface in ContosoUniversity/Services/ICourseService.cs
- [ ] T057 [US2] Implement CourseService in ContosoUniversity/Services/CourseService.cs with Include for Department
- [ ] T058 [US2] Register CourseService in ContosoUniversity/Program.cs
- [ ] T059 [US2] Create CoursesController in ContosoUniversity/Controllers/CoursesController.cs
- [ ] T060 [US2] Implement GET /api/courses endpoint with optional departmentId filter and pagination
- [ ] T061 [US2] Implement GET /api/courses/{id} endpoint
- [ ] T062 [US2] Implement POST /api/courses endpoint with department validation
- [ ] T063 [US2] Implement PUT /api/courses/{id} endpoint with concurrency handling
- [ ] T064 [US2] Implement DELETE /api/courses/{id} endpoint with enrollment check
- [ ] T065 [US2] Add XML documentation comments to CoursesController endpoints

### Frontend Implementation for User Story 2

- [ ] T066 [P] [US2] Create Course TypeScript interface in contoso-university-ui/src/types/course.ts
- [ ] T067 [P] [US2] Create courses API client in contoso-university-ui/src/services/api/courses.ts
- [ ] T068 [US2] Create CourseList component in contoso-university-ui/src/components/features/courses/CourseList.tsx
- [ ] T069 [US2] Create CourseForm component in contoso-university-ui/src/components/features/courses/CourseForm.tsx with department dropdown
- [ ] T070 [US2] Create CourseDetails component in contoso-university-ui/src/components/features/courses/CourseDetails.tsx
- [ ] T071 [US2] Create CoursesPage in contoso-university-ui/src/pages/CoursesPage.tsx with filtering
- [ ] T072 [US2] Create CourseCreatePage in contoso-university-ui/src/pages/CourseCreatePage.tsx
- [ ] T073 [US2] Create CourseEditPage in contoso-university-ui/src/pages/CourseEditPage.tsx
- [ ] T074 [US2] Create CourseDetailsPage in contoso-university-ui/src/pages/CourseDetailsPage.tsx
- [ ] T075 [US2] Add course routes to contoso-university-ui/src/App.tsx
- [ ] T076 [US2] Implement client-side validation for course forms (title, credits 0-5, department required)

**Checkpoint**: Courses CRUD fully functional - can manage courses with department relationships

---

## Phase 5: User Story 5 - Student Enrollment Management (Priority: P1)

**Goal**: Enroll students in courses and manage grades

**Independent Test**: Navigate to /enrollments, enroll students in courses, assign grades, view enrollment history

### Backend Implementation for User Story 5

- [ ] T077 [P] [US5] Create EnrollmentDto in ContosoUniversity/DTOs/EnrollmentDto.cs with CourseTitle and StudentName
- [ ] T078 [P] [US5] Create CreateEnrollmentDto in ContosoUniversity/DTOs/CreateEnrollmentDto.cs
- [ ] T079 [P] [US5] Create UpdateEnrollmentDto in ContosoUniversity/DTOs/UpdateEnrollmentDto.cs (for grade updates)
- [ ] T080 [US5] Create EnrollmentMappings extension methods in ContosoUniversity/DTOs/EnrollmentDto.cs
- [ ] T081 [US5] Create IEnrollmentService interface in ContosoUniversity/Services/IEnrollmentService.cs
- [ ] T082 [US5] Implement EnrollmentService in ContosoUniversity/Services/EnrollmentService.cs with duplicate check
- [ ] T083 [US5] Register EnrollmentService in ContosoUniversity/Program.cs
- [ ] T084 [US5] Create EnrollmentsController in ContosoUniversity/Controllers/EnrollmentsController.cs
- [ ] T085 [US5] Implement GET /api/enrollments endpoint with optional studentId and courseId filters
- [ ] T086 [US5] Implement GET /api/enrollments/{id} endpoint
- [ ] T087 [US5] Implement POST /api/enrollments endpoint with duplicate enrollment prevention (409 Conflict)
- [ ] T088 [US5] Implement PUT /api/enrollments/{id} endpoint for grade updates
- [ ] T089 [US5] Implement DELETE /api/enrollments/{id} endpoint
- [ ] T090 [US5] Add XML documentation comments to EnrollmentsController endpoints

### Frontend Implementation for User Story 5

- [ ] T091 [P] [US5] Create Enrollment TypeScript interface in contoso-university-ui/src/types/enrollment.ts with GradeValue type
- [ ] T092 [P] [US5] Create enrollments API client in contoso-university-ui/src/services/api/enrollments.ts
- [ ] T093 [US5] Create EnrollmentList component in contoso-university-ui/src/components/features/enrollments/EnrollmentList.tsx
- [ ] T094 [US5] Create EnrollmentForm component in contoso-university-ui/src/components/features/enrollments/EnrollmentForm.tsx with student/course dropdowns
- [ ] T095 [US5] Create EnrollmentsPage in contoso-university-ui/src/pages/EnrollmentsPage.tsx with filtering
- [ ] T096 [US5] Create EnrollmentCreatePage in contoso-university-ui/src/pages/EnrollmentCreatePage.tsx
- [ ] T097 [US5] Create EnrollmentEditPage in contoso-university-ui/src/pages/EnrollmentEditPage.tsx (grade editing)
- [ ] T098 [US5] Add enrollment routes to contoso-university-ui/src/App.tsx
- [ ] T099 [US5] Implement client-side validation for enrollment forms (student and course required, grade optional A-F)
- [ ] T100 [US5] Enhance StudentDetailsPage to show enrollments list with grades
- [ ] T101 [US5] Enhance CourseDetailsPage to show enrolled students with grades

**Checkpoint**: Enrollment management fully functional - can enroll students, assign grades, view enrollment history

---

## Phase 6: User Story 3 - Department Management (Priority: P2)

**Goal**: Complete CRUD operations for departments with budget tracking and administrator assignment

**Independent Test**: Navigate to /departments, create/read/update/delete departments, assign administrators, verify course count

### Backend Implementation for User Story 3

- [ ] T102 [P] [US3] Create DepartmentDto in ContosoUniversity/DTOs/DepartmentDto.cs with AdministratorName and CourseCount
- [ ] T103 [P] [US3] Create CreateDepartmentDto in ContosoUniversity/DTOs/CreateDepartmentDto.cs
- [ ] T104 [P] [US3] Create UpdateDepartmentDto in ContosoUniversity/DTOs/UpdateDepartmentDto.cs
- [ ] T105 [US3] Create DepartmentMappings extension methods in ContosoUniversity/DTOs/DepartmentDto.cs
- [ ] T106 [US3] Create IDepartmentService interface in ContosoUniversity/Services/IDepartmentService.cs
- [ ] T107 [US3] Implement DepartmentService in ContosoUniversity/Services/DepartmentService.cs with Include for Administrator
- [ ] T108 [US3] Register DepartmentService in ContosoUniversity/Program.cs
- [ ] T109 [US3] Create DepartmentsController in ContosoUniversity/Controllers/DepartmentsController.cs
- [ ] T110 [US3] Implement GET /api/departments endpoint with pagination
- [ ] T111 [US3] Implement GET /api/departments/{id} endpoint
- [ ] T112 [US3] Implement POST /api/departments endpoint with administrator validation
- [ ] T113 [US3] Implement PUT /api/departments/{id} endpoint with concurrency handling
- [ ] T114 [US3] Implement DELETE /api/departments/{id} endpoint with course check
- [ ] T115 [US3] Add XML documentation comments to DepartmentsController endpoints

### Frontend Implementation for User Story 3

- [ ] T116 [P] [US3] Create Department TypeScript interface in contoso-university-ui/src/types/department.ts
- [ ] T117 [P] [US3] Create departments API client in contoso-university-ui/src/services/api/departments.ts
- [ ] T118 [US3] Create DepartmentList component in contoso-university-ui/src/components/features/departments/DepartmentList.tsx
- [ ] T119 [US3] Create DepartmentForm component in contoso-university-ui/src/components/features/departments/DepartmentForm.tsx with instructor dropdown
- [ ] T120 [US3] Create DepartmentDetails component in contoso-university-ui/src/components/features/departments/DepartmentDetails.tsx
- [ ] T121 [US3] Create DepartmentsPage in contoso-university-ui/src/pages/DepartmentsPage.tsx
- [ ] T122 [US3] Create DepartmentCreatePage in contoso-university-ui/src/pages/DepartmentCreatePage.tsx
- [ ] T123 [US3] Create DepartmentEditPage in contoso-university-ui/src/pages/DepartmentEditPage.tsx
- [ ] T124 [US3] Create DepartmentDetailsPage in contoso-university-ui/src/pages/DepartmentDetailsPage.tsx
- [ ] T125 [US3] Add department routes to contoso-university-ui/src/App.tsx
- [ ] T126 [US3] Implement client-side validation for department forms (name required, budget >= 0)

**Checkpoint**: Department management fully functional - can manage departments with administrators and track courses

---

## Phase 7: User Story 4 - Instructor Management (Priority: P2)

**Goal**: Complete CRUD operations for instructors with course assignments and office locations

**Independent Test**: Navigate to /instructors, create/read/update/delete instructors, assign courses, manage office locations

### Backend Implementation for User Story 4

- [ ] T127 [P] [US4] Create InstructorDto in ContosoUniversity/DTOs/InstructorDto.cs with OfficeLocation and CourseAssignments
- [ ] T128 [P] [US4] Create CourseAssignmentDto in ContosoUniversity/DTOs/CourseAssignmentDto.cs
- [ ] T129 [P] [US4] Create CreateInstructorDto in ContosoUniversity/DTOs/CreateInstructorDto.cs
- [ ] T130 [P] [US4] Create UpdateInstructorDto in ContosoUniversity/DTOs/UpdateInstructorDto.cs
- [ ] T131 [US4] Create InstructorMappings extension methods in ContosoUniversity/DTOs/InstructorDto.cs
- [ ] T132 [US4] Create IInstructorService interface in ContosoUniversity/Services/IInstructorService.cs
- [ ] T133 [US4] Implement InstructorService in ContosoUniversity/Services/InstructorService.cs with Include for OfficeAssignment and CourseAssignments
- [ ] T134 [US4] Register InstructorService in ContosoUniversity/Program.cs
- [ ] T135 [US4] Create InstructorsController in ContosoUniversity/Controllers/InstructorsController.cs
- [ ] T136 [US4] Implement GET /api/instructors endpoint with pagination
- [ ] T137 [US4] Implement GET /api/instructors/{id} endpoint with course assignments
- [ ] T138 [US4] Implement POST /api/instructors endpoint with office assignment
- [ ] T139 [US4] Implement PUT /api/instructors/{id} endpoint with concurrency handling
- [ ] T140 [US4] Implement DELETE /api/instructors/{id} endpoint with department admin check
- [ ] T141 [US4] Add XML documentation comments to InstructorsController endpoints

### Frontend Implementation for User Story 4

- [ ] T142 [P] [US4] Create Instructor TypeScript interface in contoso-university-ui/src/types/instructor.ts
- [ ] T143 [P] [US4] Create CourseAssignment TypeScript interface in contoso-university-ui/src/types/instructor.ts
- [ ] T144 [P] [US4] Create instructors API client in contoso-university-ui/src/services/api/instructors.ts
- [ ] T145 [US4] Create InstructorList component in contoso-university-ui/src/components/features/instructors/InstructorList.tsx
- [ ] T146 [US4] Create InstructorForm component in contoso-university-ui/src/components/features/instructors/InstructorForm.tsx with office location
- [ ] T147 [US4] Create InstructorDetails component in contoso-university-ui/src/components/features/instructors/InstructorDetails.tsx with course list
- [ ] T148 [US4] Create InstructorsPage in contoso-university-ui/src/pages/InstructorsPage.tsx
- [ ] T149 [US4] Create InstructorCreatePage in contoso-university-ui/src/pages/InstructorCreatePage.tsx
- [ ] T150 [US4] Create InstructorEditPage in contoso-university-ui/src/pages/InstructorEditPage.tsx
- [ ] T151 [US4] Create InstructorDetailsPage in contoso-university-ui/src/pages/InstructorDetailsPage.tsx
- [ ] T152 [US4] Add instructor routes to contoso-university-ui/src/App.tsx
- [ ] T153 [US4] Implement client-side validation for instructor forms (name required, hire date validation)

**Checkpoint**: Instructor management fully functional - can manage instructors with course assignments and office locations

---

## Phase 8: User Story 6 - Enrollment Statistics Dashboard (Priority: P3)

**Goal**: Display enrollment statistics grouped by date for analytics

**Independent Test**: Navigate to /statistics, verify enrollment counts grouped by date are displayed correctly

### Backend Implementation for User Story 6

- [ ] T154 [P] [US6] Create EnrollmentDateGroupDto in ContosoUniversity/DTOs/EnrollmentDateGroupDto.cs
- [ ] T155 [US6] Create StatisticsController in ContosoUniversity/Controllers/StatisticsController.cs
- [ ] T156 [US6] Implement GET /api/statistics/enrollment-by-date endpoint with GroupBy query
- [ ] T157 [US6] Add XML documentation comments to StatisticsController endpoint

### Frontend Implementation for User Story 6

- [ ] T158 [P] [US6] Create EnrollmentDateGroup TypeScript interface in contoso-university-ui/src/types/statistics.ts
- [ ] T159 [P] [US6] Create statistics API client in contoso-university-ui/src/services/api/statistics.ts
- [ ] T160 [US6] Create EnrollmentStatistics component in contoso-university-ui/src/components/features/statistics/EnrollmentStatistics.tsx
- [ ] T161 [US6] Create StatisticsPage in contoso-university-ui/src/pages/StatisticsPage.tsx
- [ ] T162 [US6] Add statistics route to contoso-university-ui/src/App.tsx (/statistics)

**Checkpoint**: Statistics dashboard functional - enrollment trends visible by date

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T163 [P] Create HomePage in contoso-university-ui/src/pages/HomePage.tsx with links to all sections
- [ ] T164 [P] Add global CSS styles in contoso-university-ui/src/styles/global.css
- [ ] T165 [P] Create utility functions for date formatting in contoso-university-ui/src/services/formatters.ts
- [ ] T166 [P] Create validation utility functions in contoso-university-ui/src/utils/validation.ts
- [ ] T167 Update quickstart.md with complete setup and testing instructions
- [ ] T168 Test all CRUD operations on macOS environment
- [ ] T169 Test all CRUD operations on Windows environment
- [ ] T170 Verify CORS configuration works for all endpoints
- [ ] T171 Verify Swagger UI documentation is complete and accurate at https://localhost:7001/swagger
- [ ] T172 Test pagination on all list views with large datasets
- [ ] T173 Test optimistic locking by simulating concurrent edits
- [ ] T174 Test error handling for validation failures, not found, conflicts
- [ ] T175 [P] Add README.md to contoso-university-ui/ with development instructions
- [ ] T176 Commit all changes with descriptive messages per feature area

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-8)**: All depend on Foundational phase completion
  - User Story 1 (Students) - Priority P1 🎯 **MVP STARTS HERE**
  - User Story 2 (Courses) - Priority P1
  - User Story 5 (Enrollments) - Priority P1 - Depends on Students and Courses existing
  - User Story 3 (Departments) - Priority P2 - Independent
  - User Story 4 (Instructors) - Priority P2 - Independent
  - User Story 6 (Statistics) - Priority P3 - Independent
- **Polish (Phase 9)**: Depends on desired user stories being complete

### User Story Dependencies

- **User Story 1 (Students)**: Can start after Foundational - No dependencies on other stories 🎯
- **User Story 2 (Courses)**: Can start after Foundational - References Departments but can use hardcoded values initially
- **User Story 5 (Enrollments)**: Requires Student and Course entities to exist (can start after US1 and US2 backend models)
- **User Story 3 (Departments)**: Can start after Foundational - Independent
- **User Story 4 (Instructors)**: Can start after Foundational - Independent (office assignments and course assignments)
- **User Story 6 (Statistics)**: Can start after Foundational - Only requires Student entity

### Within Each User Story

- Backend DTOs before services
- Services before controllers
- Controller endpoints can be implemented in parallel
- Frontend types before API clients
- API clients before components
- Components before pages
- Pages before routes

### Parallel Opportunities

#### Setup Phase (Phase 1)
- Tasks T002, T003, T004, T005 can run in parallel (different directories)
- Tasks T010, T011, T012 can run in parallel (frontend setup)

#### Foundational Phase (Phase 2)
- Tasks T014, T017, T018, T019, T020, T021, T023, T024 can run in parallel (independent files)

#### Within Each User Story (Backend)
- DTOs (Create/Update variants) can be created in parallel
- Controller endpoints can be implemented in parallel after service exists

#### Within Each User Story (Frontend)
- Types and API client can be created in parallel
- Components can be created in parallel after API client exists
- Pages can be created in parallel after components exist

#### Across User Stories (if multiple developers)
- After Foundational phase completes:
  - Developer A: User Story 1 (Students) 🎯
  - Developer B: User Story 2 (Courses)
  - Developer C: User Story 3 (Departments)
- After US1 and US2 complete:
  - Developer D: User Story 5 (Enrollments)

---

## Parallel Example: User Story 1 Backend

```bash
# After T025 completes, launch DTO variants in parallel:
Task T026: "Create CreateStudentDto in ContosoUniversity/DTOs/CreateStudentDto.cs"
Task T027: "Create UpdateStudentDto in ContosoUniversity/DTOs/UpdateStudentDto.cs"

# After T032 completes (controller created), launch all endpoint implementations in parallel:
Task T033: "Implement GET /api/students endpoint"
Task T034: "Implement GET /api/students/{id} endpoint"
Task T035: "Implement POST /api/students endpoint"
Task T036: "Implement PUT /api/students/{id} endpoint"
Task T037: "Implement DELETE /api/students/{id} endpoint"
```

## Parallel Example: User Story 1 Frontend

```bash
# Launch types and API client in parallel:
Task T039: "Create Student TypeScript interface in contoso-university-ui/src/types/student.ts"
Task T040: "Create students API client in contoso-university-ui/src/services/api/students.ts"

# After API client exists, launch all components in parallel:
Task T042: "Create StudentList component"
Task T043: "Create StudentForm component"
Task T044: "Create StudentDetails component"

# After components exist, launch all pages in parallel:
Task T045: "Create StudentsPage"
Task T046: "Create StudentCreatePage"
Task T047: "Create StudentEditPage"
Task T048: "Create StudentDetailsPage"
```

---

## Implementation Strategy

### MVP First (Recommended - User Stories 1, 2, 5)

1. ✅ Complete Phase 1: Setup (12 tasks)
2. ✅ Complete Phase 2: Foundational (12 tasks) - **CRITICAL CHECKPOINT**
3. 🎯 Complete Phase 3: User Story 1 - Students (27 tasks)
4. **VALIDATE**: Test Students CRUD independently
5. Complete Phase 4: User Story 2 - Courses (25 tasks)
6. **VALIDATE**: Test Courses CRUD independently
7. Complete Phase 5: User Story 5 - Enrollments (25 tasks)
8. **VALIDATE**: Test Enrollments with Students and Courses
9. **MVP COMPLETE**: Deploy and demo core functionality

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (24 tasks)
2. Add User Story 1 (Students) → Test independently → Deploy/Demo (51 tasks total) 🎯
3. Add User Story 2 (Courses) → Test independently → Deploy/Demo (76 tasks total)
4. Add User Story 5 (Enrollments) → Test independently → Deploy/Demo (101 tasks total)
5. Add User Story 3 (Departments) → Test independently → Deploy/Demo (126 tasks total)
6. Add User Story 4 (Instructors) → Test independently → Deploy/Demo (153 tasks total)
7. Add User Story 6 (Statistics) → Test independently → Deploy/Demo (162 tasks total)
8. Complete Polish phase → Final validation (176 tasks total)

### Parallel Team Strategy

With 3-4 developers after Foundational phase completes:

1. **Team completes Setup + Foundational together** (24 tasks)
2. **Once Foundational done:**
   - Developer A: User Story 1 - Students (27 tasks) 🎯
   - Developer B: User Story 2 - Courses (25 tasks)
   - Developer C: User Story 3 - Departments (25 tasks)
   - Developer D: User Story 4 - Instructors (27 tasks)
3. **After US1 and US2 complete:**
   - Any developer: User Story 5 - Enrollments (25 tasks)
4. **Any time after Foundational:**
   - Any developer: User Story 6 - Statistics (5 tasks)
5. **Team completes Polish together** (14 tasks)

---

## Summary

- **Total Tasks**: 176
- **Setup Phase**: 12 tasks
- **Foundational Phase**: 12 tasks (BLOCKS all stories)
- **User Story 1 (Students)**: 27 tasks - Priority P1 🎯 MVP
- **User Story 2 (Courses)**: 25 tasks - Priority P1
- **User Story 5 (Enrollments)**: 25 tasks - Priority P1
- **User Story 3 (Departments)**: 25 tasks - Priority P2
- **User Story 4 (Instructors)**: 27 tasks - Priority P2
- **User Story 6 (Statistics)**: 5 tasks - Priority P3
- **Polish Phase**: 14 tasks

**Parallel Opportunities Identified**: 40+ tasks can run in parallel across setup, foundational, and within each user story phase

**Independent Test Criteria**: Each user story phase includes clear checkpoint validation criteria

**Suggested MVP Scope**: User Stories 1 (Students) + 2 (Courses) + 5 (Enrollments) = 77 implementation tasks after foundational

**Format Validation**: ✅ All tasks follow checkbox format with IDs, [P] markers where applicable, [Story] labels for user story tasks, and exact file paths

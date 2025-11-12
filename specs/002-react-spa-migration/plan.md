# Implementation Plan: React SPA Migration with REST API Backend

**Branch**: `002-react-spa-migration` | **Date**: 2025-11-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-react-spa-migration/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Migrate the Contoso University application from server-side Razor Pages to a modern React Single-Page Application (SPA) with a separate REST API backend. This migration maintains all existing CRUD functionality while introducing a clear separation of concerns between frontend presentation and backend business logic. The REST API will follow industry-standard conventions (flat resource structure, semantic HTTP verbs, JSON responses, optimistic locking) and enable future mobile app development. The React frontend will use TypeScript, functional components with hooks, and a feature-based organization structure.

## Technical Context

**Language/Version**: C# / .NET 9.0 (backend), TypeScript 5.x+ (frontend)  
**Primary Dependencies**:

- Backend: ASP.NET Core Web API, Entity Framework Core, Microsoft.EntityFrameworkCore.SqlServer
- Frontend: React 19+, TypeScript, React Router, Axios (or Fetch API)
  **Storage**: SQL Server (existing database via Docker/Podman container, schema unchanged)  
  **Testing**: ASP.NET Core built-in testing framework (backend), Jest + React Testing Library (frontend - optional for this phase)  
  **Target Platform**:
- Backend: Cross-platform (macOS/Windows/Linux) via .NET 9.0
- Frontend: Modern evergreen browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
  **Project Type**: Web application with separated frontend and backend (Option 2)  
  **Performance Goals**:
- API responses < 2 seconds for operations with up to 1000 records
- Form validation feedback < 500ms
- Page navigation without full page reloads
  **Constraints**:
- No authentication/authorization (open API for demo/lab environment)
- No database schema changes (use existing EF Core models)
- Must maintain 100% data integrity during migration
- Must work on both macOS and Windows
  **Scale/Scope**:
- 6 main entities (Student, Course, Department, Instructor, Enrollment, OfficeAssignment)
- ~20 API endpoints (CRUD operations for 5 resources)
- ~15 React pages/views
- Typical university data volumes (hundreds to thousands of records)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### ✅ I. Spec-Driven Development

- **Status**: PASS
- **Evidence**: Complete specification exists at `specs/002-react-spa-migration/spec.md` with user stories, functional requirements, success criteria, and clarifications
- **Impact**: This plan follows the spec; implementation will follow this plan

### ✅ II. Educational Clarity

- **Status**: PASS
- **Evidence**: Feature demonstrates modern web architecture patterns (SPA, REST API, frontend-backend separation) suitable for workshop learning
- **Impact**: Code will include explanatory comments for educational purposes; lab instructions will be created

### ✅ III. Cross-Platform Compatibility

- **Status**: PASS
- **Evidence**: .NET 9.0 and React/TypeScript are cross-platform; existing Docker/Podman support maintained
- **Impact**: Development and testing will verify functionality on both macOS and Windows

### ✅ IV. AI-Assisted Development

- **Status**: PASS
- **Evidence**: Implementation will leverage GitHub Copilot with spec context for generating API endpoints, React components, and TypeScript interfaces
- **Impact**: Code patterns will be Copilot-friendly (functional components, standard REST conventions)

### ✅ V. Incremental Modernization

- **Status**: PASS
- **Evidence**: Razor Pages backend remains functional; new REST API will coexist; frontend is independently deployable
- **Impact**: Migration can be done incrementally; rollback possible by reverting frontend deployment

### ✅ VI. REST API Design

- **Status**: PASS
- **Evidence**: Spec defines flat resource structure, semantic HTTP verbs, JSON responses, offset pagination, optimistic locking per constitutional requirements
- **Impact**: API implementation will follow all REST API Design principles from constitution

### ✅ VII. React & Frontend Best Practices

- **Status**: PASS
- **Evidence**: Spec requires functional components, TypeScript, hooks, feature-based organization per constitutional standards
- **Impact**: Frontend will follow prescribed project structure and React patterns

### ✅ VIII. Frontend-Backend Separation

- **Status**: PASS
- **Evidence**: Spec explicitly requires independent deployability, API-only backend, no business logic in frontend
- **Impact**: Clear architectural boundary enables future mobile apps and independent scaling

**Overall Gate Status**: ✅ PASS - All constitutional principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/002-react-spa-migration/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification (already exists)
├── research.md          # Phase 0 output - technology decisions and patterns
├── data-model.md        # Phase 1 output - DTOs and API contracts
├── quickstart.md        # Phase 1 output - setup and run instructions
├── contracts/           # Phase 1 output - OpenAPI/JSON schemas
│   ├── openapi.yaml    # Complete API specification
│   ├── students.json   # Student DTO schema
│   ├── courses.json    # Course DTO schema
│   ├── departments.json # Department DTO schema
│   ├── instructors.json # Instructor DTO schema
│   └── enrollments.json # Enrollment DTO schema
├── checklists/          # Quality validation checklists
│   └── requirements.md  # Spec validation checklist (already exists)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Backend API
ContosoUniversity/
├── Controllers/             # NEW: API Controllers
│   ├── StudentsController.cs
│   ├── CoursesController.cs
│   ├── DepartmentsController.cs
│   ├── InstructorsController.cs
│   └── EnrollmentsController.cs
├── DTOs/                    # NEW: Data Transfer Objects
│   ├── StudentDto.cs
│   ├── CourseDto.cs
│   ├── DepartmentDto.cs
│   ├── InstructorDto.cs
│   ├── EnrollmentDto.cs
│   └── PaginatedResponseDto.cs
├── Services/                # NEW: Business logic layer
│   ├── IStudentService.cs
│   ├── StudentService.cs
│   ├── ICourseService.cs
│   ├── CourseService.cs
│   └── [other service interfaces and implementations]
├── Middleware/              # NEW: Error handling, logging
│   ├── ErrorHandlingMiddleware.cs
│   └── RequestLoggingMiddleware.cs
├── Data/                    # EXISTING: EF Core context and initializer
│   ├── SchoolContext.cs
│   └── DbInitializer.cs
├── Models/                  # EXISTING: Entity models (unchanged)
│   ├── Student.cs
│   ├── Course.cs
│   ├── Department.cs
│   ├── Instructor.cs
│   ├── Enrollment.cs
│   └── OfficeAssignment.cs
├── Pages/                   # EXISTING: Razor Pages (maintained for comparison)
├── Program.cs               # MODIFIED: Add API services, CORS, Swagger
├── appsettings.json         # MODIFIED: Add CORS configuration
└── ContosoUniversity.csproj # MODIFIED: Add Swagger/OpenAPI packages

# Frontend SPA (NEW)
contoso-university-ui/       # NEW: React application root
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── NavigationBar.tsx
│   │   └── features/
│   │       ├── students/
│   │       │   ├── StudentList.tsx
│   │       │   ├── StudentForm.tsx
│   │       │   └── StudentDetails.tsx
│   │       ├── courses/
│   │       ├── departments/
│   │       ├── instructors/
│   │       └── enrollments/
│   ├── pages/               # Route/page components
│   │   ├── HomePage.tsx
│   │   ├── StudentsPage.tsx
│   │   ├── StudentCreatePage.tsx
│   │   ├── StudentEditPage.tsx
│   │   ├── StudentDetailsPage.tsx
│   │   ├── CoursesPage.tsx
│   │   ├── DepartmentsPage.tsx
│   │   ├── InstructorsPage.tsx
│   │   └── StatisticsPage.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useApi.ts
│   │   ├── usePagination.ts
│   │   └── useForm.ts
│   ├── context/             # React Context providers
│   │   ├── ApiContext.tsx
│   │   └── NotificationContext.tsx
│   ├── services/            # API clients
│   │   ├── api/
│   │   │   ├── client.ts    # Base API client (Axios/Fetch)
│   │   │   ├── students.ts
│   │   │   ├── courses.ts
│   │   │   ├── departments.ts
│   │   │   ├── instructors.ts
│   │   │   └── enrollments.ts
│   │   └── formatters.ts    # Date/currency formatting utilities
│   ├── types/               # TypeScript type definitions
│   │   ├── student.ts
│   │   ├── course.ts
│   │   ├── department.ts
│   │   ├── instructor.ts
│   │   ├── enrollment.ts
│   │   └── api.ts           # Common API types (PaginatedResponse, ErrorResponse)
│   ├── utils/               # Helper functions
│   │   ├── validation.ts
│   │   └── errorHandling.ts
│   ├── App.tsx              # Root component with routing
│   ├── index.tsx            # Application entry point
│   └── styles/
│       ├── global.css
│       └── variables.css
├── package.json
├── tsconfig.json
└── README.md

# Testing (optional for initial migration)
tests/
├── backend/
│   ├── api/                 # API integration tests
│   └── services/            # Service unit tests
└── frontend/
    ├── components/          # Component tests
    └── integration/         # E2E tests
```

**Structure Decision**: Selected Option 2 (Web application with separated frontend and backend). The backend extends the existing ASP.NET Core project with new API controllers and services, while the frontend is created as a completely separate React TypeScript application. This aligns with Constitutional Principle VIII (Frontend-Backend Separation) and enables independent deployment, development, and scaling of each layer.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations detected.** All constitutional principles are satisfied by this implementation approach.

---

## Phase 0: Research & Technology Decisions

### Research Tasks

The following research tasks will be completed and documented in `research.md`:

1. **ASP.NET Core Web API Best Practices**

   - Research current patterns for RESTful API design in .NET 9.0
   - Investigate service layer patterns vs. repository pattern
   - Evaluate error handling approaches (middleware vs. filters)
   - Determine DTO mapping strategies (AutoMapper vs. manual)

2. **CORS Configuration for React SPA**

   - Research recommended CORS policies for development vs. production
   - Determine appropriate allowed origins configuration
   - Investigate preflight request handling

3. **Swagger/OpenAPI Integration**

   - Research Swashbuckle.AspNetCore setup for .NET 9.0
   - Determine annotation strategies for API documentation
   - Evaluate automatic DTO schema generation

4. **React TypeScript Project Setup**

   - Research recommended tooling (Vite vs. Create React App vs. Next.js)
   - Determine TypeScript configuration best practices (strict mode)
   - Investigate build and deployment strategies

5. **React Router Configuration**

   - Research React Router v6+ patterns for SPA navigation
   - Determine route structure and nested routing approach
   - Investigate programmatic navigation and route guards

6. **API Client Architecture**

   - Research Axios vs. Fetch API for React applications
   - Determine error handling and retry strategies
   - Investigate request/response interceptors for common patterns

7. **State Management Strategy**

   - Research React Context API patterns vs. Redux/Zustand
   - Determine when to use local state vs. global state
   - Investigate caching strategies for API responses

8. **Form Handling and Validation**

   - Research controlled vs. uncontrolled components
   - Determine client-side validation library (React Hook Form, Formik, or custom)
   - Investigate real-time validation patterns

9. **Optimistic Locking Implementation**

   - Research ETag vs. timestamp approaches in ASP.NET Core
   - Determine concurrency token implementation with EF Core
   - Investigate client-side conflict resolution patterns

10. **Pagination Patterns**
    - Research offset-based pagination implementation in EF Core
    - Determine optimal page size defaults and limits
    - Investigate pagination UI component patterns

**Output**: `research.md` with decisions, rationale, and alternatives for each area

---

## Phase 1: Design & Contracts

### 1.1 Data Model Design (`data-model.md`)

Extract and document entities and their DTOs:

#### Entities (Existing - No Changes)

- **Student**: `Id`, `LastName`, `FirstMidName`, `EnrollmentDate`
- **Course**: `CourseID`, `Title`, `Credits`, `DepartmentID`
- **Department**: `DepartmentID`, `Name`, `Budget`, `StartDate`, `InstructorID` (Administrator), `RowVersion`
- **Instructor**: `ID`, `LastName`, `FirstMidName`, `HireDate`
- **Enrollment**: `EnrollmentID`, `CourseID`, `StudentID`, `Grade?`
- **OfficeAssignment**: `InstructorID`, `Location`

#### DTOs (New - To Be Designed)

**StudentDto**

- `id`: number
- `firstName`: string
- `lastName`: string
- `enrollmentDate`: string (ISO 8601)
- `enrollmentCount`: number (calculated)
- `rowVersion`: string (for optimistic locking)

**CourseDto**

- `courseId`: number
- `title`: string
- `credits`: number
- `departmentId`: number
- `departmentName`: string (from relationship)
- `enrollmentCount`: number (calculated)
- `rowVersion`: string

**DepartmentDto**

- `departmentId`: number
- `name`: string
- `budget`: number
- `startDate`: string (ISO 8601)
- `administratorId`: number | null
- `administratorName`: string | null (from relationship)
- `courseCount`: number (calculated)
- `rowVersion`: string

**InstructorDto**

- `id`: number
- `firstName`: string
- `lastName`: string
- `hireDate`: string (ISO 8601)
- `officeLocation`: string | null
- `courseAssignments`: CourseAssignmentDto[] (list of courses)
- `rowVersion`: string

**EnrollmentDto**

- `enrollmentId`: number
- `courseId`: number
- `courseTitle`: string (from relationship)
- `studentId`: number
- `studentName`: string (from relationship)
- `grade`: string | null ('A', 'B', 'C', 'D', 'F')
- `rowVersion`: string

**PaginatedResponseDto<T>**

- `data`: T[]
- `totalCount`: number
- `pageNumber`: number
- `pageSize`: number
- `totalPages`: number

**ErrorResponseDto**

- `error`: string
- `field`: string | null (for validation errors)

#### Validation Rules

- Student: `FirstName` required, max 50 chars; `LastName` required, max 50 chars; `EnrollmentDate` required, cannot be future date
- Course: `Title` required, max 50 chars; `Credits` required, range 0-5; `DepartmentId` required, must exist
- Department: `Name` required, max 50 chars; `Budget` required, >= 0; `StartDate` required; `AdministratorId` optional, must exist if provided
- Instructor: `FirstName` required, max 50 chars; `LastName` required, max 50 chars; `HireDate` required, cannot be future date
- Enrollment: `CourseId` required, must exist; `StudentId` required, must exist; `Grade` optional, must be one of {A, B, C, D, F}

**Output**: `data-model.md` with complete DTO specifications and validation rules

### 1.2 API Contracts (`contracts/` directory)

Generate OpenAPI 3.0 specification and JSON schemas:

#### API Endpoints

**Students Resource** (`/api/students`)

- `GET /api/students?pageNumber={n}&pageSize={s}` → 200 PaginatedResponse<StudentDto>
- `GET /api/students/{id}` → 200 StudentDto | 404 ErrorResponse
- `POST /api/students` → 201 StudentDto (Location header) | 400 ErrorResponse
- `PUT /api/students/{id}` → 200 StudentDto | 404 | 409 Conflict | 400
- `DELETE /api/students/{id}` → 204 No Content | 404 | 409 Conflict (if has enrollments)

**Courses Resource** (`/api/courses`)

- `GET /api/courses?pageNumber={n}&pageSize={s}&departmentId={id}` → 200 PaginatedResponse<CourseDto>
- `GET /api/courses/{id}` → 200 CourseDto | 404
- `POST /api/courses` → 201 CourseDto | 400
- `PUT /api/courses/{id}` → 200 CourseDto | 404 | 409 | 400
- `DELETE /api/courses/{id}` → 204 | 404 | 409 Conflict (if has enrollments)

**Departments Resource** (`/api/departments`)

- `GET /api/departments?pageNumber={n}&pageSize={s}` → 200 PaginatedResponse<DepartmentDto>
- `GET /api/departments/{id}` → 200 DepartmentDto | 404
- `POST /api/departments` → 201 DepartmentDto | 400
- `PUT /api/departments/{id}` → 200 DepartmentDto | 404 | 409 | 400
- `DELETE /api/departments/{id}` → 204 | 404 | 409 Conflict (if has courses)

**Instructors Resource** (`/api/instructors`)

- `GET /api/instructors?pageNumber={n}&pageSize={s}` → 200 PaginatedResponse<InstructorDto>
- `GET /api/instructors/{id}` → 200 InstructorDto | 404
- `POST /api/instructors` → 201 InstructorDto | 400
- `PUT /api/instructors/{id}` → 200 InstructorDto | 404 | 409 | 400
- `DELETE /api/instructors/{id}` → 204 | 404 | 409 Conflict (if assigned as admin)

**Enrollments Resource** (`/api/enrollments`)

- `GET /api/enrollments?studentId={id}&courseId={id}&pageNumber={n}&pageSize={s}` → 200 PaginatedResponse<EnrollmentDto>
- `GET /api/enrollments/{id}` → 200 EnrollmentDto | 404
- `POST /api/enrollments` → 201 EnrollmentDto | 400 | 409 Conflict (duplicate enrollment)
- `PUT /api/enrollments/{id}` → 200 EnrollmentDto (grade update) | 404 | 409 | 400
- `DELETE /api/enrollments/{id}` → 204 | 404

**Statistics Endpoint** (`/api/statistics`)

- `GET /api/statistics/enrollment-by-date` → 200 EnrollmentDateGroupDto[]

#### Schema Files

- `openapi.yaml`: Complete OpenAPI 3.0 specification with all endpoints, schemas, responses
- `students.json`: JSON Schema for StudentDto
- `courses.json`: JSON Schema for CourseDto
- `departments.json`: JSON Schema for DepartmentDto
- `instructors.json`: JSON Schema for InstructorDto
- `enrollments.json`: JSON Schema for EnrollmentDto

**Output**: Complete API contracts in `contracts/` directory

### 1.3 Frontend Type Definitions

Based on API contracts, generate TypeScript interfaces in frontend `src/types/`:

```typescript
// types/student.ts
export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  enrollmentDate: string;
  enrollmentCount: number;
  rowVersion: string;
}

// types/api.ts
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ErrorResponse {
  error: string;
  field?: string;
}
```

**Output**: TypeScript interface definitions aligned with API DTOs

### 1.4 Quickstart Guide (`quickstart.md`)

Document setup and run instructions:

#### Backend Setup

1. Prerequisites: .NET 9.0 SDK, Docker/Podman, SQL Server container running
2. Navigate to `ContosoUniversity/` directory
3. Run migrations: `dotnet ef database update`
4. Start API: `dotnet run` (listens on https://localhost:7001)
5. Open Swagger UI: https://localhost:7001/swagger

#### Frontend Setup

1. Prerequisites: Node.js 20+ LTS, npm/yarn/pnpm
2. Navigate to `contoso-university-ui/` directory
3. Install dependencies: `npm install`
4. Configure API URL in `.env`: `VITE_API_URL=https://localhost:7001`
5. Start dev server: `npm run dev` (opens on http://localhost:5173)

#### Testing the Integration

1. Verify backend: curl https://localhost:7001/api/students?pageNumber=1&pageSize=10
2. Verify frontend: Open http://localhost:5173, navigate to Students page
3. Test CRUD: Create a new student, edit, view details, delete

**Output**: `quickstart.md` with step-by-step instructions

### 1.5 Update Agent Context

Run the agent context update script to add new technologies:

```bash
.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot
```

This will update `.github/copilot-instructions.md` with:

- React / TypeScript (frontend)
- ASP.NET Core Web API (backend)
- Commands for running backend API and frontend dev server
- Code style notes for React functional components and REST API conventions

**Output**: Updated `.github/copilot-instructions.md`

---

## Phase 2: Planning Complete - Next Steps

This command (`/speckit.plan`) stops after Phase 1 design. The following artifacts have been generated:

✅ `plan.md` - This implementation plan
⏳ `research.md` - Technology decisions and best practices (Phase 0 output - to be generated)
⏳ `data-model.md` - Complete DTO specifications (Phase 1 output - to be generated)
⏳ `contracts/` - OpenAPI and JSON schemas (Phase 1 output - to be generated)
⏳ `quickstart.md` - Setup instructions (Phase 1 output - to be generated)
⏳ `.github/copilot-instructions.md` - Updated agent context (Phase 1 output - to be updated)

**Next Command**: `/speckit.tasks` to generate detailed task breakdown from this plan

**Branch**: `002-react-spa-migration`

**Implementation Approach**:

1. **Backend First**: Create API controllers, DTOs, services, configure CORS/Swagger
2. **Frontend Scaffold**: Set up React TypeScript project with routing and base structure
3. **Feature-by-Feature**: Implement Students → Courses → Enrollments → Departments → Instructors → Statistics
4. **Testing & Refinement**: Manual testing on both macOS/Windows, performance validation

**Estimated Effort**:

- Backend API: 3-4 days (controllers, DTOs, services, error handling, Swagger setup)
- Frontend Setup: 1-2 days (project scaffolding, routing, base components, API client)
- Feature Implementation: 5-7 days (all CRUD operations for 5 resources + statistics)
- Testing & Documentation: 2-3 days (cross-platform testing, lab instructions)
- **Total**: ~11-16 days for complete migration

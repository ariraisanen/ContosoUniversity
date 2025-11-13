# Data Model & UI State

**Feature**: Student List Page Enhancement  
**Date**: November 13, 2025  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the data structures and UI state models for the enhanced Students list page. All models are TypeScript interfaces that describe the shape of data in the React frontend. No backend models are changed.

---

## Core Domain Models (Existing)

These models already exist in the project and are **not modified** by this feature.

### Student

**Location**: `contoso-university-ui/src/types/student.ts`

```typescript
export interface Student {
  id: number;
  lastName: string;
  firstMidName: string;
  enrollmentDate: string; // ISO 8601 date string
  enrollmentCount: number;
  fullName: string; // Computed: "LastName, FirstMidName"
}
```

**Description**: Represents a student entity as returned by the API. Used for display in the table and details page.

---

### PaginatedResponse<T>

**Location**: `contoso-university-ui/src/types/api.ts`

```typescript
export interface PaginatedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
```

**Description**: Generic paginated response structure returned by the API. Used for all paginated list endpoints.

---

## UI State Models (New)

These models represent the state of the enhanced UI components and do not correspond to backend entities.

### SearchState

**Location**: `contoso-university-ui/src/pages/students/StudentList.tsx` (local state)

```typescript
interface SearchState {
  searchTerm: string; // Current value in search input (changes on every keystroke)
  debouncedSearchTerm: string; // Debounced value (changes after 400ms delay)
  isSearching: boolean; // True during debounce delay or API call
}
```

**Description**: Tracks the state of the search functionality, including the raw input value and the debounced value used for API calls.

**State Transitions**:

1. User types → `searchTerm` updates immediately, `isSearching` = true
2. 400ms after last keystroke → `debouncedSearchTerm` updates, API call triggered
3. API responds → `isSearching` = false

**Validation Rules**:

- `searchTerm`: Any string (no validation, empty string allowed)
- `debouncedSearchTerm`: Derived from `searchTerm` after delay
- `isSearching`: Boolean flag for loading indicators

---

### SortState

**Location**: `contoso-university-ui/src/pages/students/StudentList.tsx` (local state)

```typescript
type SortColumn =
  | "lastName"
  | "firstName"
  | "enrollmentDate"
  | "enrollmentCount";
type SortDirection = "asc" | "desc";

interface SortState {
  sortBy: SortColumn;
  sortDirection: SortDirection;
}
```

**Description**: Tracks which column is currently sorted and in which direction.

**State Transitions**:

1. User clicks unsorted column → `sortBy` = clicked column, `sortDirection` = 'asc'
2. User clicks same column (already sorted asc) → `sortDirection` = 'desc'
3. User clicks same column (already sorted desc) → `sortDirection` = 'asc' (toggle)
4. User clicks different column → `sortBy` = new column, `sortDirection` = 'asc'

**Default Values**:

- `sortBy`: 'lastName' (alphabetical by last name)
- `sortDirection`: 'asc' (A-Z)

**Validation Rules**:

- `sortBy`: Must be one of the four valid columns
- `sortDirection`: Must be 'asc' or 'desc'

---

### LoadMoreState

**Location**: `contoso-university-ui/src/pages/students/StudentList.tsx` (local state)

```typescript
interface LoadMoreState {
  currentPage: number; // 1-based page number (increments with Load More)
  pageSize: number; // Number of items per page (fixed at 12)
  totalPages: number; // Calculated by backend
  totalCount: number; // Total items in dataset
  hasMoreStudents: boolean; // Can load more (currentPage < totalPages)
  isLoadingMore: boolean; // Loading indicator for Load More button
}
```

**Description**: Tracks progressive loading state for Load More functionality.

**State Transitions**:

1. User clicks Load More → `isLoadingMore` = true, `currentPage` increments, API call
2. API responds → New students append to existing array, `isLoadingMore` = false
3. Search/sort changes → `currentPage` resets to 1, existing students cleared, API call
4. All students loaded → `hasMoreStudents` = false, Load More button hidden

**Validation Rules**:

- `currentPage`: Integer ≥ 1, ≤ `totalPages`
- `pageSize`: Fixed at 12 (4 rows × 3 columns on desktop)
- `totalPages`, `totalCount`: Provided by API (read-only)
- `hasMoreStudents`: `currentPage < totalPages`

**Default Values**:

- `currentPage`: 1
- `pageSize`: 12
- `totalPages`: 0 (until first API response)
- `totalCount`: 0 (until first API response)
- `hasMoreStudents`: false
- `isLoadingMore`: false

---

### DeleteDialogState

**Location**: `contoso-university-ui/src/pages/students/StudentList.tsx` (local state)

```typescript
interface DeleteDialogState {
  isOpen: boolean;
  studentId: number | null;
  studentName: string;
}
```

**Description**: Tracks the state of the delete confirmation dialog.

**State Transitions**:

1. User clicks "Delete" → `isOpen` = true, `studentId` and `studentName` set
2. User clicks "Cancel" or Escape → `isOpen` = false, `studentId` = null
3. User confirms deletion → API call, then `isOpen` = false after success

**Validation Rules**:

- `isOpen`: Boolean flag
- `studentId`: Required when `isOpen` is true, null otherwise
- `studentName`: Required when `isOpen` is true (used in confirmation message)

**Default Values**:

- `isOpen`: false
- `studentId`: null
- `studentName`: '' (empty string)

---

### QueryParamState

**Location**: `contoso-university-ui/src/hooks/useQueryParams.ts` (derived from URL)

```typescript
interface QueryParamState {
  search: string; // From ?search=term (default: '')
  sortBy: SortColumn; // From ?sortBy=column (default: 'lastName')
  sortDir: SortDirection; // From ?sortDir=asc|desc (default: 'asc')
}
```

**Description**: Represents the state extracted from URL query parameters. This state is the source of truth for bookmarkability and browser navigation. Note: Load More functionality doesn't persist page state in URL.

**State Synchronization**:

- URL changes → `QueryParamState` updates → Component state updates → UI re-renders (students reset to page 1)
- User interaction → Component state updates → URL updates (via `setSearchParams`)

**Validation Rules**:

- `search`: String, default to empty string if missing
- `sortBy`: Validate against SortColumn type, default to 'lastName'
- `sortDir`: Validate against 'asc' | 'desc', default to 'asc'

**Example URLs**:

```
/students?search=john&sortBy=enrollmentDate&sortDir=desc
/students?search=smith
/students?sortBy=firstName&sortDir=asc
```

---

## Component Props Interfaces

These interfaces define the shape of props passed to reusable components.

### StudentCardProps

**Location**: `contoso-university-ui/src/components/features/StudentCard.tsx` (new component)

```typescript
interface StudentCardProps {
  student: Student;
  onDelete: (id: number, fullName: string) => void;
}
```

**Description**: Props for a student card component in the grid layout.

**Usage Example**:

```typescript
<StudentCard student={student} onDelete={handleDeleteClick} />
```

---

### StudentDeleteDialogProps

**Location**: `contoso-university-ui/src/components/features/StudentDeleteDialog.tsx` (new component)

```typescript
interface StudentDeleteDialogProps {
  isOpen: boolean;
  studentName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean; // Optional: shows loading state on confirm button
}
```

**Description**: Props for the delete confirmation dialog.

**Usage Example**:

```typescript
<StudentDeleteDialog
  isOpen={deleteDialog.isOpen}
  studentName={deleteDialog.studentName}
  onConfirm={handleConfirmDelete}
  onCancel={handleCancelDelete}
  isDeleting={isDeleting}
/>
```

---

## Custom Hook Return Types

These interfaces define the shape of values returned by custom hooks.

### UseDebounceReturn<T>

**Location**: `contoso-university-ui/src/hooks/useDebounce.ts` (new hook)

```typescript
function useDebounce<T>(value: T, delay: number): T;
```

**Description**: Generic debounce hook that delays updating a value until after a specified delay.

**Usage Example**:

```typescript
const [searchTerm, setSearchTerm] = useState("");
const debouncedSearchTerm = useDebounce(searchTerm, 400);

useEffect(() => {
  // Fetch students with debouncedSearchTerm
}, [debouncedSearchTerm]);
```

---

### UseStudentListParamsReturn

**Location**: `contoso-university-ui/src/hooks/useQueryParams.ts` (new hook)

```typescript
interface UseStudentListParamsReturn {
  page: number;
  pageSize: number;
  search: string;
  sortBy: SortColumn;
  sortDir: SortDirection;
  updateParams: (updates: Partial<QueryParamState>) => void;
}
```

**Description**: Hook for managing URL query parameters for the student list page.

**Usage Example**:

```typescript
const { page, pageSize, search, sortBy, sortDir, updateParams } =
  useStudentListParams();

// Update search and reset to page 1
updateParams({ search: "john", page: 1 });

// Update sort
updateParams({ sortBy: "enrollmentDate", sortDir: "desc" });
```

---

### UsePaginationReturn

**Location**: `contoso-university-ui/src/hooks/usePagination.ts` (existing, to be modified)

```typescript
interface UsePaginationReturn {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasMoreStudents: boolean; // NEW: replaces hasNext
  setCurrentPage: (page: number) => void;
  setPaginationData: (data: {
    totalCount: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  }) => void;
  incrementPage: () => void; // NEW: for Load More button
  resetPagination: () => void;
}
```

**Description**: Hook for managing progressive loading state with Load More functionality.

**Modification Required**:

- Add `incrementPage` function to increment `currentPage`
- Add `hasMoreStudents` computed property (currentPage < totalPages)
- Remove navigation functions (goToFirstPage, goToLastPage, goToNextPage, goToPreviousPage)
- Remove `setPageSize` (fixed at 12)

---

## API Request/Response Types (Existing, No Changes)

The following API contract types already exist and support all requirements. No modifications needed.

### GET /api/students Request

```typescript
interface GetStudentsRequest {
  pageNumber: number; // 1-based page number
  pageSize: number; // Items per page (1-100)
  searchString?: string; // Optional: filter by name
  sortBy?: string; // NEW: sort column (if backend supports)
  sortDirection?: string; // NEW: 'asc' or 'desc' (if backend supports)
}
```

**Note**: `sortBy` and `sortDirection` parameters will be added to the API if backend enhancement is implemented (see research.md, Research Task 2). If not implemented, sorting will be client-side for the current page only.

### GET /api/students Response

```typescript
interface GetStudentsResponse {
  data: Student[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
```

**Description**: Paginated response with student data and metadata. Type alias: `PaginatedResponse<Student>`.

---

## State Flow Diagram

```
User Actions → Component State → URL Query Params → API Request → API Response → Component State → UI Update

Example: User searches for "john" and loads more students
1. User types "john" in search input
2. searchTerm state updates immediately → "john"
3. After 400ms debounce → debouncedSearchTerm → "john"
4. useEffect triggers → updateParams({ search: "john" }), currentPage resets to 1, students array cleared
5. URL updates → ?search=john&sortBy=lastName&sortDir=asc
6. API call → GET /api/students?pageNumber=1&pageSize=12&searchString=john
7. API response → { data: [...12 students], totalCount: 25, totalPages: 3, ... }
8. students state updates → UI re-renders with 12 cards in grid
9. User clicks Load More → currentPage increments to 2, isLoadingMore = true
10. API call → GET /api/students?pageNumber=2&pageSize=12&searchString=john
11. API response → { data: [...12 more students], ... }
12. New students append to existing array → UI shows 24 cards, isLoadingMore = false
```

---

## Validation & Constraints Summary

| Field                    | Type           | Constraints                                                        | Default    |
| ------------------------ | -------------- | ------------------------------------------------------------------ | ---------- |
| `currentPage`            | number         | ≥ 1, ≤ totalPages                                                  | 1          |
| `pageSize`               | number         | Fixed at 12 (optimized for 3-column grid)                          | 12         |
| `searchTerm`             | string         | Any string                                                         | '' (empty) |
| `sortBy`                 | SortColumn     | 'lastName' \| 'firstName' \| 'enrollmentDate' \| 'enrollmentCount' | 'lastName' |
| `sortDirection`          | SortDirection  | 'asc' \| 'desc'                                                    | 'asc'      |
| `deleteDialog.studentId` | number \| null | null when closed, valid ID when open                               | null       |
| `deleteDialog.isOpen`    | boolean        | true \| false                                                      | false      |
| `hasMoreStudents`        | boolean        | currentPage < totalPages                                           | false      |
| `isLoadingMore`          | boolean        | true during Load More API call                                     | false      |

---

## Entity Relationships

```
StudentList (Page Component)
├── SearchState (local state)
│   ├── searchTerm → useDebounce → debouncedSearchTerm
│   └── Triggers API call on debounced value change (resets to page 1, clears existing students)
├── SortState (local state)
│   ├── sortBy + sortDirection
│   └── Controlled by Select dropdown + direction toggle button
├── LoadMoreState (local state)
│   ├── currentPage (increments on Load More click)
│   ├── pageSize (fixed at 12)
│   ├── hasMoreStudents (currentPage < totalPages)
│   └── isLoadingMore (loading indicator for Load More button)
├── DeleteDialogState (local state)
│   ├── isOpen + studentId + studentName
│   └── Controls StudentDeleteDialog component visibility
├── QueryParamState (useQueryParams hook)
│   ├── Derived from URL query parameters (search, sortBy, sortDir)
│   ├── Synced with component state
│   └── Enables bookmarkability (note: loaded cards don't persist)
└── StudentCard[] (grid layout)
    ├── Rendered in responsive grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
    ├── Each card shows student info + rounded pill action buttons
    └── Progressive loading: new cards append on Load More
```

---

## Summary

This data model defines:

- **5 UI state models**: SearchState, SortState, LoadMoreState, DeleteDialogState, QueryParamState
- **2 component prop interfaces**: StudentCardProps, StudentDeleteDialogProps
- **3 custom hook interfaces**: UseDebounceReturn, UseStudentListParamsReturn, UsePaginationReturn

**Key Principles**:

- No backend models changed (uses existing Student and PaginatedResponse)
- All state is TypeScript-typed for type safety
- State is normalized (single source of truth)
- URL query parameters store filters/sorting (search, sortBy, sortDir) - Load More state not persisted
- Local state manages UI concerns (dialog visibility, debouncing, progressive loading)
- Fixed pageSize of 12 optimized for 3-column grid (4 rows \u00d7 3 columns)

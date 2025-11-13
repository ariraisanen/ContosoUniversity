# UI Component Contracts

**Feature**: Student List Page Enhancement  
**Date**: November 13, 2025  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the contracts (interfaces, props, behaviors) for all UI components involved in the Student List Page Enhancement. These are frontend-only contracts that describe component APIs, not REST API endpoints (the backend API requires no changes).

---

## Component 1: StudentList (Page Component)

**Location**: `contoso-university-ui/src/pages/students/StudentList.tsx` (MODIFY existing)

### Purpose

Main page component that orchestrates all student list functionality: search, sort, pagination, and actions.

### Props

None (top-level route component)

### State Management

```typescript
interface StudentListState {
  // Data
  students: Student[];
  loading: boolean;
  error: string | null;

  // Search
  searchTerm: string;
  debouncedSearchTerm: string;

  // Sort
  sortBy: SortColumn;
  sortDirection: SortDirection;

  // Progressive Loading (Load More)
  currentPage: number;
  pageSize: number; // Fixed at 12 (optimized for 3-column grid)
  totalPages: number;
  totalCount: number;
  hasMoreStudents: boolean; // currentPage < totalPages
  isLoadingMore: boolean; // Loading indicator for Load More button

  // Delete dialog
  deleteDialog: {
    isOpen: boolean;
    studentId: number | null;
    studentName: string;
  };
  isDeleting: boolean;
}
```

### Behaviors

#### Search

- **Input**: User types in search field
- **Output**: Filters student list by name (first or last name, case-insensitive)
- **Debounce**: 400ms delay after last keystroke before API call
- **Reset**: Clear button resets search term to empty string
- **Page reset**: New search resets to page 1
- **Loading**: Show loading indicator during debounce and API call

#### Sort

- **Input**: User selects sort field from Select dropdown (Last Name, First Name, Enrollment Date, Enrollments)
- **Output**: Re-sorts student list by selected column
- **Direction toggle**: Separate button with arrow icon toggles between asc/desc
- **Visual**: Select shows current sort field, toggle button shows direction (ArrowUp/ArrowDown icon)
- **Page reset**: Sorting resets to page 1 and clears accumulated cards

#### Progressive Loading (Load More)

- **Input**: User clicks "Load More" button at bottom of card grid
- **Output**: Appends next 12 students to existing card grid
- **Page size**: Fixed at 12 (optimized for 3-column grid: 4 rows × 3 columns)
- **Loading state**: Button shows spinner during API call
- **End state**: Button hidden/disabled when all students loaded (hasMoreStudents = false)
- **Reset**: New search or sort clears accumulated cards and resets to page 1

#### Actions

- **Details**: Navigate to `/students/:id` (existing behavior)
- **Edit**: Navigate to `/students/edit/:id` (existing behavior)
- **Delete**: Open confirmation dialog, then delete student on confirm

#### URL Synchronization

- **Query params**: search, sortBy, sortDir (Load More state NOT persisted)
- **Update**: URL updates when filter or sort changes
- **Read**: On mount, read initial state from URL query params (always starts at page 1)
- **Browser navigation**: Back/forward buttons restore search/sort, but loaded cards reset to page 1

### Event Handlers

```typescript
const handleSearchChange = (value: string) => void;
const handleSearchClear = () => void;
const handleSortChange = (column: SortColumn) => void;
const handleSortDirectionToggle = () => void;
const handleLoadMore = () => Promise<void>;
const handleDeleteClick = (id: number, name: string) => void;
const handleDeleteConfirm = () => Promise<void>;
const handleDeleteCancel = () => void;
```

### Accessibility

- All interactive elements keyboard accessible (Tab, Enter, Escape)
- Search input has label: "Search students by name"
- Error messages announced to screen readers (aria-live="polite")
- Loading states announced (aria-busy="true")
- Focus management: after delete, focus returns to action button

---

## Component 2: StudentCard

**Location**: `contoso-university-ui/src/components/features/StudentCard.tsx` (NEW)

### Purpose

Displays a single student's information in a card format for the grid layout.

### Props

```typescript
interface StudentCardProps {
  student: Student; // Student data
  onDelete: (id: number, fullName: string) => void; // Delete handler
}
```

### Structure

```tsx
<Card>
  <CardHeader>
    <CardTitle>{student.fullName}</CardTitle>
    <CardDescription>
      Enrolled: {formatDate(student.enrollmentDate)}
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <div className="text-sm">
        <span className="text-muted-foreground">Last Name:</span>{" "}
        {student.lastName}
      </div>
      <div className="text-sm">
        <span className="text-muted-foreground">First Name:</span>{" "}
        {student.firstMidName}
      </div>
      <div className="text-sm">
        <span className="text-muted-foreground">Enrollments:</span>{" "}
        {student.enrollmentCount}
      </div>
    </div>
  </CardContent>
  <CardFooter className="flex gap-2 justify-end">
    {/* Rounded pill action buttons */}
    <Button variant="outline" size="sm" asChild className="rounded-full">
      <Link to={`/students/${student.id}`}>Details</Link>
    </Button>
    <Button variant="outline" size="sm" asChild className="rounded-full">
      <Link to={`/students/edit/${student.id}`}>Edit</Link>
    </Button>
    <Button
      variant="outline"
      size="sm"
      className="rounded-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
      onClick={() => onDelete(student.id, student.fullName)}
    >
      Delete
    </Button>
  </CardFooter>
</Card>
```

### Behaviors

- **Hover**: Subtle shadow/elevation increase
- **Actions**:
  - Details button navigates to `/students/:id`
  - Edit button navigates to `/students/edit/:id`
  - Delete button calls `onDelete` handler
- **Responsive**: Card stretches to fill grid column width

### Styling

- **Pill buttons**: `rounded-full` class creates rounded pill appearance
- **Card spacing**: Consistent padding using Tailwind's `space-y-*` utilities
- **Typography**: text-sm for details, CardTitle for name, muted-foreground for labels
- **Border**: Standard card border with hover elevation

### Accessibility

- **Semantic HTML**: Proper heading hierarchy (CardTitle uses h3)
- **Button labels**: Clear action labels ("Details", "Edit", "Delete")
- **Focus indicators**: Visible focus rings on all interactive elements
- **Screen readers**: All text content accessible

### Usage Example

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {students.map((student) => (
    <StudentCard
      key={student.id}
      student={student}
      onDelete={handleDeleteClick}
    />
  ))}
</div>
```

---

## Component 3: StudentDeleteDialog

**Location**: `contoso-university-ui/src/components/features/StudentDeleteDialog.tsx` (NEW)

### Purpose

Confirmation dialog for deleting a student record.

### Props

```typescript
interface StudentDeleteDialogProps {
  isOpen: boolean; // Controls dialog visibility
  studentName: string; // Student's full name for confirmation message
  onConfirm: () => void; // Called when user confirms deletion
  onCancel: () => void; // Called when user cancels or presses Escape
  isDeleting?: boolean; // Optional: shows loading state on confirm button
}
```

### Behaviors

- **Open**: Dialog appears when `isOpen` changes to true
- **Close**: Dialog closes when:
  - User clicks "Cancel" button → calls `onCancel()`
  - User presses Escape key → calls `onCancel()`
  - User clicks outside dialog (optional) → calls `onCancel()`
- **Confirm**: User clicks "Delete" button → calls `onConfirm()`
- **Loading**: When `isDeleting` is true, disable buttons and show spinner on Delete button

### Content

```typescript
Title: "Delete Student"
Description: "Are you sure you want to delete {studentName}? This action cannot be undone."
Actions:
  - Cancel button (outline variant)
  - Delete button (destructive variant, red)
```

### Accessibility

- **Focus trap**: Focus locked inside dialog (can't tab outside)
- **Initial focus**: Cancel button receives focus when dialog opens
- **Escape key**: Closes dialog (handled by shadcn/ui Dialog)
- **ARIA**: Dialog title provides accessible name
- **Screen reader**: Announcement when dialog opens

### Usage Example

```tsx
<StudentDeleteDialog
  isOpen={deleteDialog.isOpen}
  studentName={deleteDialog.studentName}
  onConfirm={handleDeleteConfirm}
  onCancel={handleDeleteCancel}
  isDeleting={isDeleting}
/>
```

---

## Load More Functionality (Integrated into StudentList)

**Location**: `contoso-university-ui/src/pages/students/StudentList.tsx` (part of main component)

### Purpose

Progressive loading pattern that appends more students to the card grid when user clicks "Load More" button.

### State

```typescript
interface LoadMoreState {
  currentPage: number; // Increments with each Load More click
  hasMoreStudents: boolean; // currentPage < totalPages
  isLoadingMore: boolean; // Loading indicator for button
  pageSize: number; // Fixed at 12 (4 rows × 3 columns)
}
```

### Behaviors

#### Load More Button

- **Visibility**: Shown when `hasMoreStudents` is true
- **Position**: Bottom of card grid, centered
- **Click**: Increments `currentPage`, fetches next batch, appends to existing students array
- **Loading state**: Shows spinner icon in button during API call
- **Disabled**: Disabled during loading or when all students loaded

#### Data Accumulation

- **Initial load**: Page 1, first 12 students displayed
- **Load More**: Page 2, next 12 students appended (total 24 displayed)
- **Continue**: Page 3, next 12 students appended (total 36 displayed)
- **End**: When `currentPage === totalPages`, hide/disable button

#### Reset Scenarios

- **New search**: Clears accumulated students, resets to page 1
- **Sort change**: Clears accumulated students, resets to page 1
- **Initial mount**: Starts at page 1

### Layout

```tsx
{
  /* Card grid */
}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {students.map((student) => (
    <StudentCard
      key={student.id}
      student={student}
      onDelete={handleDeleteClick}
    />
  ))}
</div>;

{
  /* Load More button */
}
{
  hasMoreStudents && (
    <div className="flex justify-center mt-8">
      <Button
        variant="outline"
        size="lg"
        onClick={handleLoadMore}
        disabled={isLoadingMore}
        className="min-w-[200px]"
      >
        {isLoadingMore ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            Load More Students
            <ChevronDown className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
```

### API Integration

```typescript
const handleLoadMore = async () => {
  setIsLoadingMore(true);
  try {
    const nextPage = currentPage + 1;
    const response = await getStudents(nextPage, pageSize, debouncedSearchTerm);

    // Append new students to existing array
    setStudents((prev) => [...prev, ...response.data]);

    setCurrentPage(nextPage);
    setPaginationData({
      totalCount: response.totalCount,
      totalPages: response.totalPages,
      hasPrevious: response.hasPrevious,
      hasNext: response.hasNext,
    });
  } catch (error) {
    showError("Failed to load more students");
  } finally {
    setIsLoadingMore(false);
  }
};
```

### Accessibility

- **Button label**: Clear, descriptive ("Load More Students")
- **Loading state**: Button disabled, spinner visible, text changes to "Loading..."
- **Keyboard**: Accessible via Tab, activated with Enter or Space
- **Screen reader**: Announces "Loading" state when button is clicked

### Performance

- **Append only**: New students appended to array (no full re-render of existing cards)
- **React.memo**: StudentCard component memoized to prevent unnecessary re-renders
- **Virtualization**: Not needed for 12 students per page (reasonable DOM size)
      <Button onClick={() => onPageChange(currentPage + 1)} disabled={!hasNext}>
        <ChevronRight />
      </Button>
      <Button onClick={() => onPageChange(totalPages)} disabled={!hasNext}>
        <ChevronsRight />
      </Button>
    </div>
  </div>

````

### Accessibility
- All buttons keyboard accessible
- Disabled buttons not tabbable (disabled attribute)
- Current page announced to screen readers
- Page size selector has label: "Rows per page"

---

## Hook 1: useDebounce

**Location**: `contoso-university-ui/src/hooks/useDebounce.ts` (NEW)

### Purpose
Generic hook to debounce a value (delay updates until after a period of inactivity).

### Signature
```typescript
function useDebounce<T>(value: T, delay: number): T
````

### Parameters

- `value`: The value to debounce (any type)
- `delay`: Delay in milliseconds (e.g., 400)

### Returns

- Debounced value (same type as input)

### Behavior

- Returns initial value immediately on mount
- When `value` changes, starts a timer for `delay` milliseconds
- If `value` changes again before timer expires, cancels previous timer and starts new one
- After timer expires without interruption, updates debounced value
- Cleans up timer on unmount

### Usage Example

```typescript
const [searchTerm, setSearchTerm] = useState("");
const debouncedSearchTerm = useDebounce(searchTerm, 400);

useEffect(() => {
  fetchStudents(debouncedSearchTerm);
}, [debouncedSearchTerm]);
```

---

## Hook 2: useStudentListParams

**Location**: `contoso-university-ui/src/hooks/useQueryParams.ts` (NEW)

### Purpose

Hook for managing URL query parameters specific to the student list page.

### Signature

```typescript
function useStudentListParams(): UseStudentListParamsReturn;
```

### Returns

```typescript
interface UseStudentListParamsReturn {
  page: number; // Current page from URL (default: 1)
  pageSize: number; // Page size from URL (default: 10)
  search: string; // Search term from URL (default: '')
  sortBy: SortColumn; // Sort column from URL (default: 'lastName')
  sortDir: SortDirection; // Sort direction from URL (default: 'asc')
  updateParams: (updates: Partial<QueryParamState>) => void; // Update URL
}
```

### Behavior

- Reads query parameters from URL on mount
- Validates and provides default values for invalid/missing params
- `updateParams` merges new values with existing params and updates URL
- URL updates do NOT add new history entry (uses replace for intermediate states)

### Validation Rules

- `page`: Parse as integer, clamp to ≥ 1, default to 1 if invalid
- `pageSize`: Parse as integer, validate against [10, 25, 50, 100], default to 10
- `search`: String, default to '' if missing
- `sortBy`: Validate against SortColumn type, default to 'lastName'
- `sortDir`: Validate against 'asc' | 'desc', default to 'asc'

### Usage Example

```typescript
const { page, pageSize, search, sortBy, sortDir, updateParams } =
  useStudentListParams();

// Update search and reset to page 1
updateParams({ search: "john", page: 1 });

// Toggle sort direction
updateParams({ sortDir: sortDir === "asc" ? "desc" : "asc" });
```

---

## Hook 3: usePagination (Modified)

**Location**: `contoso-university-ui/src/hooks/usePagination.ts` (MODIFY existing)

### Purpose

Hook for managing pagination state (already exists, minor modification needed).

### Signature

```typescript
function usePagination(props?: UsePaginationProps): UsePaginationReturn;
```

### Modification Required

Ensure `setPageSize` function resets `currentPage` to 1 when page size changes.

**Current implementation** (already correct):

```typescript
const handleSetPageSize = useCallback((size: number) => {
  setPageSize(size);
  setCurrentPage(1); // ✅ Already resets to page 1
}, []);
```

**No changes needed** - existing implementation already meets requirements.

---

## Integration: Component Interaction Flow

### User searches for a student

```
1. User types "john" in search input
   └─→ StudentList: setSearchTerm("john")

2. useDebounce delays for 400ms
   └─→ debouncedSearchTerm becomes "john"

3. useEffect detects debouncedSearchTerm change
   └─→ updateParams({ search: "john", page: 1 })
   └─→ URL updates: ?search=john&page=1

4. useEffect detects URL change
   └─→ fetchStudents(page=1, pageSize=10, search="john")

5. API returns filtered students
   └─→ setStudents(filteredStudents)
   └─→ UI re-renders with filtered table
```

### User sorts by enrollment date

```
1. User clicks "Enrollment Date" column header
   └─→ SortableTableHead: onSort("enrollmentDate")

2. handleSortColumn determines new direction
   └─→ If first click: direction = "asc"
   └─→ If same column: toggle direction

3. Update URL with sort params
   └─→ updateParams({ sortBy: "enrollmentDate", sortDir: "asc" })
   └─→ URL updates: ?...&sortBy=enrollmentDate&sortDir=asc

4. useEffect detects URL change
   └─→ fetchStudents(page=current, pageSize=10, search=current, sortBy="enrollmentDate", sortDir="asc")

5. API returns sorted students
   └─→ setStudents(sortedStudents)
   └─→ UI re-renders with sorted table
   └─→ SortableTableHead shows ArrowUp icon on Enrollment Date column
```

### User deletes a student

```
1. User clicks "Delete" button on student row
   └─→ StudentList: handleDeleteClick(studentId, studentName)
   └─→ setDeleteDialog({ isOpen: true, studentId, studentName })

2. StudentDeleteDialog renders
   └─→ Shows confirmation: "Delete {studentName}?"
   └─→ Focus trapped inside dialog

3a. User clicks "Cancel" or presses Escape
   └─→ handleDeleteCancel()
   └─→ setDeleteDialog({ isOpen: false, studentId: null, studentName: "" })
   └─→ Dialog closes, focus returns to delete button

3b. User clicks "Delete" (confirm)
   └─→ handleDeleteConfirm()
   └─→ setIsDeleting(true) // Disable buttons, show spinner
   └─→ API call: deleteStudent(studentId)

4. API responds with success
   └─→ setIsDeleting(false)
   └─→ setDeleteDialog({ isOpen: false, ... })
   └─→ showNotification("Successfully deleted {studentName}")
   └─→ fetchStudents() // Refresh list
   └─→ If last student on page, navigate to previous page
```

---

## Summary

This contract document defines:

- **4 components**: StudentList (modified), SortableTableHead (new), StudentDeleteDialog (new), Pagination (modified)
- **3 custom hooks**: useDebounce (new), useStudentListParams (new), usePagination (modified)
- **Component interactions**: Search, sort, pagination, delete workflows
- **Accessibility requirements**: Keyboard navigation, ARIA labels, focus management
- **State synchronization**: URL query params as source of truth

All contracts follow:

- TypeScript strict mode (explicit types)
- shadcn/ui component library (Button, Input, Dialog, Select, Table)
- Tailwind CSS design system (semantic colors, spacing)
- React best practices (functional components, hooks, memoization)

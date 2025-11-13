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
  
  // Pagination (from usePagination hook)
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  
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
- **Input**: User clicks column header (Last Name, First Name, Enrollment Date, Enrollments)
- **Output**: Re-sorts student list by selected column
- **Toggle**: Clicking same column toggles between asc/desc
- **Visual**: Arrow icon shows current sort column and direction
- **Page reset**: Sorting does NOT reset page (maintains current page)

#### Pagination
- **Input**: User clicks page number, prev/next buttons, or changes page size
- **Output**: Navigates to selected page or changes number of rows displayed
- **Page size options**: [10, 25, 50, 100]
- **Page reset**: Changing page size resets to page 1
- **Disabled states**: First/prev disabled on page 1, last/next disabled on last page

#### Actions
- **Details**: Navigate to `/students/:id` (existing behavior)
- **Edit**: Navigate to `/students/edit/:id` (existing behavior)
- **Delete**: Open confirmation dialog, then delete student on confirm

#### URL Synchronization
- **Query params**: page, pageSize, search, sortBy, sortDir
- **Update**: URL updates when any filter/sort/pagination changes
- **Read**: On mount, read initial state from URL query params
- **Browser navigation**: Back/forward buttons work correctly

### Event Handlers
```typescript
const handleSearchChange = (value: string) => void;
const handleSearchClear = () => void;
const handleSortColumn = (column: SortColumn) => void;
const handlePageChange = (page: number) => void;
const handlePageSizeChange = (size: number) => void;
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

## Component 2: SortableTableHead

**Location**: `contoso-university-ui/src/components/common/SortableTableHead.tsx` (NEW)

### Purpose
Reusable sortable table header cell with visual sort indicators.

### Props
```typescript
interface SortableTableHeadProps {
  column: SortColumn;              // Column identifier
  label: string;                   // Display text (e.g., "Last Name")
  currentSort: SortColumn;         // Currently sorted column
  currentDirection: SortDirection; // Current sort direction
  onSort: (column: SortColumn) => void; // Sort handler
  className?: string;              // Optional additional styles
}
```

### Behaviors
- **Click**: Calls `onSort(column)` to trigger sort
- **Visual states**:
  - Unsorted: `<ArrowUpDown />` icon (opacity 50%)
  - Sorted asc: `<ArrowUp />` icon (full opacity, primary color)
  - Sorted desc: `<ArrowDown />` icon (full opacity, primary color)
- **Hover**: Background highlight, cursor pointer
- **Focus**: Visible focus ring (keyboard navigation)

### Rendering Logic
```typescript
if (currentSort === column) {
  // This column is currently sorted
  icon = currentDirection === 'asc' ? <ArrowUp /> : <ArrowDown />;
} else {
  // This column is not sorted
  icon = <ArrowUpDown className="opacity-50" />;
}
```

### Accessibility
- **Role**: Button (clickable header)
- **ARIA label**: "Sort by {label} {current state}" (e.g., "Sort by Last Name ascending")
- **ARIA hidden**: Icons marked aria-hidden="true" (label provides context)
- **Keyboard**: Activates on Enter or Space

### Usage Example
```tsx
<TableHead>
  <SortableTableHead
    column="lastName"
    label="Last Name"
    currentSort={sortBy}
    currentDirection={sortDirection}
    onSort={handleSort}
  />
</TableHead>
```

---

## Component 3: StudentDeleteDialog

**Location**: `contoso-university-ui/src/components/features/StudentDeleteDialog.tsx` (NEW)

### Purpose
Confirmation dialog for deleting a student record.

### Props
```typescript
interface StudentDeleteDialogProps {
  isOpen: boolean;        // Controls dialog visibility
  studentName: string;    // Student's full name for confirmation message
  onConfirm: () => void;  // Called when user confirms deletion
  onCancel: () => void;   // Called when user cancels or presses Escape
  isDeleting?: boolean;   // Optional: shows loading state on confirm button
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

## Component 4: Pagination (Enhanced)

**Location**: `contoso-university-ui/src/components/common/Pagination.tsx` (MODIFY existing)

### Purpose
Pagination controls with page jumping and page size selection.

### Props
```typescript
interface PaginationProps {
  currentPage: number;                 // Current page (1-based)
  totalPages: number;                  // Total number of pages
  pageSize: number;                    // Current page size
  totalCount: number;                  // Total number of items
  onPageChange: (page: number) => void; // Page navigation handler
  onPageSizeChange: (size: number) => void; // Page size change handler
  hasPrevious: boolean;                // Can navigate backward
  hasNext: boolean;                    // Can navigate forward
}
```

### Behaviors

#### Page Navigation
- **First page**: Click `<<` button → calls `onPageChange(1)`
- **Previous page**: Click `<` button → calls `onPageChange(currentPage - 1)`
- **Page number**: Click page button → calls `onPageChange(clickedPage)`
- **Next page**: Click `>` button → calls `onPageChange(currentPage + 1)`
- **Last page**: Click `>>` button → calls `onPageChange(totalPages)`

#### Page Number Display
- **Few pages (≤7)**: Show all page numbers (1, 2, 3, 4, 5, 6, 7)
- **Many pages (>7)**: Show first, last, current ± 1, with ellipsis
  - Example: 1 ... 5, 6, 7 ... 20 (when on page 6 of 20)
  - Always show: first page, last page, current page
  - Show up to 2 adjacent pages (current - 1, current + 1)
  - Use ellipsis (...) to indicate gap

#### Page Size Selection
- **Options**: [10, 25, 50, 100]
- **Selector**: Dropdown (Select component)
- **Change**: Calls `onPageSizeChange(newSize)`, which should reset to page 1

#### Disabled States
- **First/Previous**: Disabled when `hasPrevious` is false (on first page)
- **Last/Next**: Disabled when `hasNext` is false (on last page)
- **Page numbers**: Current page button is highlighted (variant="default"), others are outline

### Layout
```tsx
<div className="flex items-center justify-between gap-4">
  {/* Left: Page size selector */}
  <div className="flex items-center gap-2">
    <span className="text-sm text-muted-foreground">Rows per page:</span>
    <Select value={pageSize.toString()} onValueChange={(val) => onPageSizeChange(parseInt(val))}>
      {/* Options: 10, 25, 50, 100 */}
    </Select>
  </div>
  
  {/* Right: Page navigation */}
  <div className="flex items-center gap-1">
    <Button onClick={() => onPageChange(1)} disabled={!hasPrevious}>
      <ChevronsLeft />
    </Button>
    <Button onClick={() => onPageChange(currentPage - 1)} disabled={!hasPrevious}>
      <ChevronLeft />
    </Button>
    
    {/* Page numbers with ellipsis logic */}
    
    <Button onClick={() => onPageChange(currentPage + 1)} disabled={!hasNext}>
      <ChevronRight />
    </Button>
    <Button onClick={() => onPageChange(totalPages)} disabled={!hasNext}>
      <ChevronsRight />
    </Button>
  </div>
</div>
```

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
```

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
const [searchTerm, setSearchTerm] = useState('');
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
function useStudentListParams(): UseStudentListParamsReturn
```

### Returns
```typescript
interface UseStudentListParamsReturn {
  page: number;                // Current page from URL (default: 1)
  pageSize: number;            // Page size from URL (default: 10)
  search: string;              // Search term from URL (default: '')
  sortBy: SortColumn;          // Sort column from URL (default: 'lastName')
  sortDir: SortDirection;      // Sort direction from URL (default: 'asc')
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
const { page, pageSize, search, sortBy, sortDir, updateParams } = useStudentListParams();

// Update search and reset to page 1
updateParams({ search: 'john', page: 1 });

// Toggle sort direction
updateParams({ sortDir: sortDir === 'asc' ? 'desc' : 'asc' });
```

---

## Hook 3: usePagination (Modified)

**Location**: `contoso-university-ui/src/hooks/usePagination.ts` (MODIFY existing)

### Purpose
Hook for managing pagination state (already exists, minor modification needed).

### Signature
```typescript
function usePagination(props?: UsePaginationProps): UsePaginationReturn
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

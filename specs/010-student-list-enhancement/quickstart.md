# Quickstart: Student List Enhancement

**Feature**: Student List Page Enhancement  
**Date**: November 13, 2025  
**Audience**: Developers implementing this feature

## Overview

This guide helps you implement the enhanced Students list page with real-time search, sortable columns, improved pagination, and accessible action buttons. The implementation is frontend-only using existing React, TypeScript, shadcn/ui, and Tailwind CSS infrastructure.

---

## Prerequisites

Before starting implementation:

✅ **Environment Setup**
- Node.js and npm installed
- Frontend dev server running: `cd contoso-university-ui && npm run dev`
- Backend API running: `cd ContosoUniversity && dotnet run`
- SQL Server container running (Docker or Podman)

✅ **Knowledge Required**
- React 19.2.0 (functional components, hooks)
- TypeScript 5.9.3 (interfaces, generics)
- React Router DOM 7.9.5 (useSearchParams hook)
- shadcn/ui components (Button, Input, Dialog, Select, Table)
- Tailwind CSS 4.x (utility classes, responsive design)

✅ **Documentation Review**
- Read [`spec.md`](./spec.md) - Feature specification
- Read [`research.md`](./research.md) - Technical decisions
- Read [`data-model.md`](./data-model.md) - State and type definitions
- Read [`contracts/ui-components.md`](./contracts/ui-components.md) - Component contracts

---

## Implementation Phases

### Phase 1: Create Custom Hooks (Foundation)

**Estimated time**: 30 minutes

#### 1.1 Create useDebounce Hook

**File**: `contoso-university-ui/src/hooks/useDebounce.ts`

```typescript
import { useState, useEffect } from 'react';

/**
 * Debounces a value by delaying its update until after a specified delay.
 * Useful for search inputs to avoid excessive API calls.
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (e.g., 400)
 * @returns The debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 400);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if value changes before delay expires
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

**Why**: Prevents excessive API calls during typing. User types "john" → 4 API calls without debounce, 1 API call with debounce.

#### 1.2 Create useQueryParams Hook

**File**: `contoso-university-ui/src/hooks/useQueryParams.ts`

```typescript
import { useSearchParams } from 'react-router-dom';

type SortColumn = 'lastName' | 'firstName' | 'enrollmentDate' | 'enrollmentCount';
type SortDirection = 'asc' | 'desc';

interface QueryParamState {
  page: number;
  pageSize: number;
  search: string;
  sortBy: SortColumn;
  sortDir: SortDirection;
}

/**
 * Custom hook for managing URL query parameters for the student list page.
 * Provides type-safe access to query params with validation and defaults.
 * Enables bookmarkability and browser back/forward navigation.
 * 
 * @returns Query parameters and update function
 */
export function useStudentListParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse and validate query parameters
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const pageSizeParam = parseInt(searchParams.get('pageSize') || '10');
  const pageSize = [10, 25, 50, 100].includes(pageSizeParam) ? pageSizeParam : 10;
  const search = searchParams.get('search') || '';
  
  const sortByParam = searchParams.get('sortBy') || 'lastName';
  const sortBy: SortColumn = ['lastName', 'firstName', 'enrollmentDate', 'enrollmentCount'].includes(sortByParam)
    ? (sortByParam as SortColumn)
    : 'lastName';
  
  const sortDirParam = searchParams.get('sortDir') || 'asc';
  const sortDir: SortDirection = sortDirParam === 'desc' ? 'desc' : 'asc';

  /**
   * Updates query parameters in the URL.
   * Merges new values with existing params.
   * 
   * @param updates - Partial object of params to update
   */
  const updateParams = (updates: Partial<QueryParamState>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        newParams.set(key, value.toString());
      } else if (value === '' && key === 'search') {
        newParams.delete(key); // Remove empty search param
      }
    });
    
    setSearchParams(newParams, { replace: true }); // Use replace to avoid cluttering history
  };

  return {
    page,
    pageSize,
    search,
    sortBy,
    sortDir,
    updateParams,
  };
}
```

**Why**: Single source of truth for filters/sorting/pagination. URL query params enable bookmarking and sharing links to filtered views.

#### 1.3 Verify usePagination Hook

**File**: `contoso-university-ui/src/hooks/usePagination.ts` (EXISTING)

**Action**: Verify that `setPageSize` resets `currentPage` to 1. Current implementation already correct (see line 58-61 in existing file).

**No changes needed** ✅

---

### Phase 2: Create Reusable Components

**Estimated time**: 45 minutes

#### 2.1 Create SortableTableHead Component

**File**: `contoso-university-ui/src/components/common/SortableTableHead.tsx` (NEW)

```typescript
import { Button } from '@/components/ui/button';
import { TableHead } from '@/components/ui/table';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

type SortColumn = 'lastName' | 'firstName' | 'enrollmentDate' | 'enrollmentCount';
type SortDirection = 'asc' | 'desc';

interface SortableTableHeadProps {
  column: SortColumn;
  label: string;
  currentSort: SortColumn;
  currentDirection: SortDirection;
  onSort: (column: SortColumn) => void;
  className?: string;
}

/**
 * Sortable table header cell with visual sort indicators.
 * Shows arrow icons to indicate sort state (unsorted, ascending, descending).
 * 
 * @example
 * <SortableTableHead
 *   column="lastName"
 *   label="Last Name"
 *   currentSort={sortBy}
 *   currentDirection={sortDirection}
 *   onSort={handleSort}
 * />
 */
export function SortableTableHead({
  column,
  label,
  currentSort,
  currentDirection,
  onSort,
  className,
}: SortableTableHeadProps) {
  const isSorted = currentSort === column;
  const isAscending = isSorted && currentDirection === 'asc';
  const isDescending = isSorted && currentDirection === 'desc';

  // Determine aria-label for accessibility
  const ariaLabel = isSorted
    ? `Sort by ${label} ${isAscending ? 'descending' : 'ascending'}`
    : `Sort by ${label}`;

  return (
    <TableHead className={className}>
      <Button
        variant="ghost"
        onClick={() => onSort(column)}
        className="h-8 px-2 lg:px-3 hover:bg-muted"
        aria-label={ariaLabel}
      >
        <span>{label}</span>
        {isSorted ? (
          isAscending ? (
            <ArrowUp className="ml-2 h-4 w-4" aria-hidden="true" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" />
          )
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" aria-hidden="true" />
        )}
      </Button>
    </TableHead>
  );
}
```

**Why**: Reusable sortable header reduces duplication (4 sortable columns). Visual feedback (arrow icons) shows current sort state.

#### 2.2 Create StudentDeleteDialog Component

**File**: `contoso-university-ui/src/components/features/StudentDeleteDialog.tsx` (NEW)

```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface StudentDeleteDialogProps {
  isOpen: boolean;
  studentName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

/**
 * Confirmation dialog for deleting a student.
 * Shows student name to prevent accidental deletions.
 * Accessible with keyboard navigation and screen reader support.
 * 
 * @example
 * <StudentDeleteDialog
 *   isOpen={deleteDialog.isOpen}
 *   studentName={deleteDialog.studentName}
 *   onConfirm={handleDeleteConfirm}
 *   onCancel={handleDeleteCancel}
 *   isDeleting={isDeleting}
 * />
 */
export function StudentDeleteDialog({
  isOpen,
  studentName,
  onConfirm,
  onCancel,
  isDeleting = false,
}: StudentDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Student</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{studentName}</strong>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

**Why**: Prevents accidental deletions with explicit confirmation. Shows student name for clarity. Accessible (focus trap, Escape key, ARIA labels).

#### 2.3 Enhance Pagination Component

**File**: `contoso-university-ui/src/components/common/Pagination.tsx` (MODIFY)

**Changes needed**:
1. Add page size selector (Select component)
2. Add page number buttons with ellipsis logic
3. Add first/last page buttons (double chevrons)

**Implementation**: See [`contracts/ui-components.md`](./contracts/ui-components.md) Component 4 for detailed code.

**Key additions**:
- `onPageSizeChange` prop and handler
- `getPageNumbers()` function for ellipsis logic
- `<Select>` component for page size dropdown
- `<ChevronsLeft>` and `<ChevronsRight>` icons for first/last page

---

### Phase 3: Enhance StudentList Page

**Estimated time**: 60 minutes

#### 3.1 Update State Management

**File**: `contoso-university-ui/src/pages/students/StudentList.tsx`

**Add new state**:
```typescript
// Search state
const [searchInput, setSearchInput] = useState('');
const debouncedSearch = useDebounce(searchInput, 400);

// Sort state
const [sortBy, setSortBy] = useState<SortColumn>('lastName');
const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

// Delete dialog state
const [deleteDialog, setDeleteDialog] = useState({
  isOpen: false,
  studentId: null as number | null,
  studentName: '',
});
const [isDeleting, setIsDeleting] = useState(false);

// URL synchronization
const { page, pageSize, search, sortBy: urlSortBy, sortDir, updateParams } = useStudentListParams();
```

**Synchronize with URL on mount**:
```typescript
useEffect(() => {
  setSearchInput(search);
  setSortBy(urlSortBy);
  setSortDirection(urlDir);
  setCurrentPage(page);
  setPageSize(pageSize);
}, []); // Run once on mount
```

#### 3.2 Update fetchStudents Function

**Modify API call** to include sort parameters (if backend supports):
```typescript
const fetchStudents = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await getStudents(
      currentPage,
      pageSize,
      debouncedSearch || undefined,
      sortBy, // NEW: pass sort column
      sortDirection // NEW: pass sort direction
    );
    setStudents(response.data);
    setPaginationData({
      totalCount: response.totalCount,
      totalPages: response.totalPages,
      hasPrevious: response.hasPrevious,
      hasNext: response.hasNext,
    });
  } catch (err) {
    // Error handling...
  } finally {
    setLoading(false);
  }
};
```

**Note**: If backend doesn't support sorting yet, implement client-side sorting as interim solution.

#### 3.3 Implement Event Handlers

```typescript
// Search handlers
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchInput(e.target.value);
};

const handleSearchClear = () => {
  setSearchInput('');
  updateParams({ search: '', page: 1 });
};

// Sort handler
const handleSort = (column: SortColumn) => {
  const newDirection = sortBy === column && sortDirection === 'asc' ? 'desc' : 'asc';
  setSortBy(column);
  setSortDirection(newDirection);
  updateParams({ sortBy: column, sortDir: newDirection });
};

// Delete handlers
const handleDeleteClick = (id: number, fullName: string) => {
  setDeleteDialog({
    isOpen: true,
    studentId: id,
    studentName: fullName,
  });
};

const handleDeleteConfirm = async () => {
  if (!deleteDialog.studentId) return;
  
  setIsDeleting(true);
  try {
    await deleteStudent(deleteDialog.studentId);
    success(`Successfully deleted ${deleteDialog.studentName}`);
    
    // If last student on page, go to previous page
    if (students.length === 1 && currentPage > 1) {
      updateParams({ page: currentPage - 1 });
    } else {
      fetchStudents(); // Refresh current page
    }
    
    setDeleteDialog({ isOpen: false, studentId: null, studentName: '' });
  } catch (err: any) {
    showError(err.response?.data?.message || 'Failed to delete student');
  } finally {
    setIsDeleting(false);
  }
};

const handleDeleteCancel = () => {
  setDeleteDialog({ isOpen: false, studentId: null, studentName: '' });
};
```

#### 3.4 Update Table Rendering

**Replace existing TableHeader** with sortable headers:
```tsx
<TableHeader>
  <TableRow>
    <SortableTableHead
      column="lastName"
      label="Last Name"
      currentSort={sortBy}
      currentDirection={sortDirection}
      onSort={handleSort}
    />
    <SortableTableHead
      column="firstName"
      label="First Name"
      currentSort={sortBy}
      currentDirection={sortDirection}
      onSort={handleSort}
      className="hidden md:table-cell"
    />
    <SortableTableHead
      column="enrollmentDate"
      label="Enrollment Date"
      currentSort={sortBy}
      currentDirection={sortDirection}
      onSort={handleSort}
      className="hidden lg:table-cell"
    />
    <SortableTableHead
      column="enrollmentCount"
      label="Enrollments"
      currentSort={sortBy}
      currentDirection={sortDirection}
      onSort={handleSort}
      className="hidden lg:table-cell"
    />
    <TableHead className="text-right">Actions</TableHead>
  </TableRow>
</TableHeader>
```

**Update action buttons** to use delete dialog:
```tsx
<Button
  variant="ghost"
  size="sm"
  onClick={() => handleDeleteClick(student.id, student.fullName)}
  className="text-destructive hover:text-destructive"
>
  Delete
</Button>
```

#### 3.5 Add StudentDeleteDialog

**Add dialog at end of component**:
```tsx
<StudentDeleteDialog
  isOpen={deleteDialog.isOpen}
  studentName={deleteDialog.studentName}
  onConfirm={handleDeleteConfirm}
  onCancel={handleDeleteCancel}
  isDeleting={isDeleting}
/>
```

#### 3.6 Update useEffect Dependencies

**Sync with URL params**:
```typescript
useEffect(() => {
  fetchStudents();
}, [currentPage, pageSize, debouncedSearch, sortBy, sortDirection]);
```

**Sync URL when state changes**:
```typescript
useEffect(() => {
  updateParams({
    page: currentPage,
    pageSize,
    search: debouncedSearch,
    sortBy,
    sortDir: sortDirection,
  });
}, [currentPage, pageSize, debouncedSearch, sortBy, sortDirection]);
```

---

### Phase 4: Backend Enhancement (Optional)

**Estimated time**: 30 minutes (if needed)

**Only required if**: Backend doesn't currently support `sortBy` and `sortDirection` parameters.

#### 4.1 Update StudentsController

**File**: `ContosoUniversity/Controllers/StudentsController.cs`

**Add parameters** to `GetStudents` method:
```csharp
[HttpGet]
public async Task<ActionResult<PaginatedResponseDto<StudentDto>>> GetStudents(
    [FromQuery] int pageNumber = 1,
    [FromQuery] int pageSize = 10,
    [FromQuery] string? searchString = null,
    [FromQuery] string? sortBy = "lastName",
    [FromQuery] string? sortDirection = "asc")
{
    // Validation...
    var result = await _studentService.GetStudentsAsync(
        pageNumber, 
        pageSize, 
        searchString, 
        sortBy, 
        sortDirection);
    return Ok(result);
}
```

#### 4.2 Update StudentService

**File**: `ContosoUniversity/Services/StudentService.cs`

**Add sorting logic** to query:
```csharp
public async Task<PaginatedResponseDto<StudentDto>> GetStudentsAsync(
    int pageNumber, 
    int pageSize, 
    string? searchString,
    string? sortBy,
    string? sortDirection)
{
    var query = _context.Students.AsQueryable();
    
    // Search filter (existing)
    if (!string.IsNullOrWhiteSpace(searchString))
    {
        query = query.Where(s => 
            s.LastName.Contains(searchString) || 
            s.FirstMidName.Contains(searchString));
    }
    
    // Sorting (NEW)
    query = (sortBy?.ToLower(), sortDirection?.ToLower()) switch
    {
        ("firstname", "desc") => query.OrderByDescending(s => s.FirstMidName),
        ("firstname", _) => query.OrderBy(s => s.FirstMidName),
        ("enrollmentdate", "desc") => query.OrderByDescending(s => s.EnrollmentDate),
        ("enrollmentdate", _) => query.OrderBy(s => s.EnrollmentDate),
        ("enrollmentcount", "desc") => query.OrderByDescending(s => s.Enrollments.Count),
        ("enrollmentcount", _) => query.OrderBy(s => s.Enrollments.Count),
        (_, "desc") => query.OrderByDescending(s => s.LastName), // Default
        _ => query.OrderBy(s => s.LastName) // Default
    };
    
    // Pagination (existing)
    return await PaginatedList<Student>.CreateAsync(query, pageNumber, pageSize);
}
```

---

### Phase 5: Testing & Validation

**Estimated time**: 30 minutes

#### 5.1 Manual Testing Checklist

**Search Functionality**:
- [ ] Type in search field → results filter in real-time (after 400ms)
- [ ] Clear search → all students restored
- [ ] Search with no results → helpful empty state message shown
- [ ] Rapid typing → only one API call after typing stops

**Sorting Functionality**:
- [ ] Click "Last Name" header → sorts A-Z
- [ ] Click "Last Name" again → sorts Z-A
- [ ] Click different column → sorts by new column ascending
- [ ] Arrow icon shows on sorted column (up for asc, down for desc)
- [ ] Search + sort → sorting applies to filtered results

**Pagination**:
- [ ] Page numbers shown correctly (with ellipsis for many pages)
- [ ] Click page number → navigates to that page
- [ ] Click next/previous → navigates correctly
- [ ] Click first/last (double chevrons) → jumps to first/last page
- [ ] Change page size → resets to page 1
- [ ] Page size options: 10, 25, 50, 100 all work
- [ ] Disabled states correct (prev/first on page 1, next/last on last page)

**Delete Functionality**:
- [ ] Click "Delete" → confirmation dialog opens
- [ ] Dialog shows student's full name
- [ ] Click "Cancel" → dialog closes, no deletion
- [ ] Press Escape → dialog closes, no deletion
- [ ] Click "Delete" in dialog → student deleted, success notification shown
- [ ] Delete last student on page → navigates to previous page
- [ ] Delete button shows spinner during API call

**URL Persistence**:
- [ ] Search, sort, paginate → URL updates with query params
- [ ] Copy URL, paste in new tab → state restored correctly
- [ ] Browser back button → previous state restored
- [ ] Browser forward button → next state restored

**Accessibility**:
- [ ] Tab key navigates through all interactive elements
- [ ] Focus indicators visible on all elements
- [ ] Enter key activates buttons
- [ ] Escape key closes dialog
- [ ] Screen reader announces loading states
- [ ] ARIA labels present on sortable headers

**Responsive Design**:
- [ ] Mobile (< 640px): Last Name + Actions visible, others hidden
- [ ] Tablet (640px-1023px): Last Name, First Name, Actions visible
- [ ] Desktop (≥ 1024px): All columns visible
- [ ] Pagination wraps correctly on mobile
- [ ] Action buttons stack on mobile

#### 5.2 Performance Validation

- [ ] Search debounce: Verify only 1 API call after typing stops
- [ ] Sorting: Verify UI reorders in < 200ms
- [ ] Page load: Initial load < 2 seconds
- [ ] Large dataset: Test with 1000 students, verify no lag

#### 5.3 Error Handling

- [ ] Network failure during fetch → error message shown with retry button
- [ ] Delete failure → error message shown, student remains in list
- [ ] Invalid URL query params → defaults applied, no crash

---

## Troubleshooting

### Issue: Debounce not working (API called on every keystroke)

**Solution**: Verify `useDebounce` hook is called correctly and `debouncedSearch` is used in `useEffect` dependency array, not `searchInput`.

### Issue: URL not updating when state changes

**Solution**: Ensure `updateParams` is called in event handlers. Check that `useSearchParams` is from `react-router-dom`, not another library.

### Issue: Sorting doesn't work or sorts only current page

**Solution**: If backend doesn't support sorting, implement client-side sort as interim. Use `useMemo` to sort students array before rendering.

### Issue: Delete dialog doesn't close on Escape

**Solution**: Verify `onOpenChange` prop is set on `Dialog` component and calls `onCancel` when `open` becomes false.

### Issue: Focus ring not visible

**Solution**: Check Tailwind CSS focus utilities are applied. Use `focus-visible:ring-2 focus-visible:ring-ring` classes.

---

## Next Steps

After implementing this feature:

1. **Generate tasks**: Run `/speckit.tasks` to create detailed task breakdown
2. **Code review**: Verify constitutional compliance (accessibility, educational clarity)
3. **User testing**: Have stakeholders test the enhanced UI
4. **Documentation**: Update project README if needed
5. **Future enhancements**: Consider adding:
   - Advanced filters (by enrollment date range)
   - Bulk actions (delete multiple students)
   - Export to CSV functionality
   - Column visibility toggle

---

## Reference Links

- **Spec**: [spec.md](./spec.md)
- **Research**: [research.md](./research.md)
- **Data Model**: [data-model.md](./data-model.md)
- **Contracts**: [contracts/ui-components.md](./contracts/ui-components.md)
- **shadcn/ui Docs**: https://ui.shadcn.com/docs
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **React Hooks Docs**: https://react.dev/reference/react/hooks

---

## Estimated Total Time

- Phase 1 (Hooks): 30 minutes
- Phase 2 (Components): 45 minutes
- Phase 3 (StudentList): 60 minutes
- Phase 4 (Backend, optional): 30 minutes
- Phase 5 (Testing): 30 minutes

**Total**: 2.5-3 hours (without backend changes), 3-3.5 hours (with backend sorting)

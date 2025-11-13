# Research & Technical Decisions

**Feature**: Student List Page Enhancement  
**Date**: November 13, 2025  
**Phase**: 0 - Outline & Research

## Overview

This document consolidates research findings and technical decisions for implementing enhanced filtering, sorting, and user interactions on the Students list page. All decisions prioritize using existing project infrastructure (React 19.2.0, TypeScript 5.9.3, shadcn/ui, Tailwind CSS 4.x) and maintaining consistency with the project's constitution.

---

## Research Task 1: Real-Time Search Implementation Patterns

### Decision: Debounced Search with useDebounce Hook

**Rationale**:
- Prevents excessive API calls during rapid typing (performance optimization)
- Industry-standard pattern for real-time search (used by Google, Amazon, etc.)
- React Hook pattern aligns with project's functional component approach
- Debounce delay of 300-500ms provides optimal UX (feels immediate, reduces API load)

**Implementation Approach**:
```typescript
// Custom hook: hooks/useDebounce.ts
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage in StudentList.tsx
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 400);

useEffect(() => {
  fetchStudents(currentPage, pageSize, debouncedSearch);
}, [debouncedSearch, currentPage, pageSize]);
```

**Alternatives Considered**:
1. **Throttling**: Rejected because debouncing (delay after last keystroke) is better for search than throttling (periodic execution)
2. **Search button only**: Rejected because spec requires real-time filtering (FR-001)
3. **Lodash debounce**: Rejected to avoid additional dependency when custom hook is simple and educational

**Best Practices**:
- Clear timeout on component unmount to prevent memory leaks
- Make debounce delay configurable (default 400ms, tunable for performance)
- Show loading indicator during debounce period for user feedback
- Cancel in-flight requests when new search initiated (AbortController)

---

## Research Task 2: Client-Side vs Server-Side Sorting

### Decision: Server-Side Sorting (API Enhancement)

**Rationale**:
- Scalability: Client-side sorting fails with pagination (only sorts visible page)
- Consistency: Sorting across all 1000 students requires server-side implementation
- Performance: Sorting 1000 records client-side would cause UI lag
- API already supports pagination, natural extension to add sorting parameters

**Implementation Approach**:
```typescript
// API call with sort parameters
const response = await getStudents(
  pageNumber, 
  pageSize, 
  searchString,
  sortBy: 'lastName' | 'firstName' | 'enrollmentDate' | 'enrollmentCount',
  sortDirection: 'asc' | 'desc'
);

// Backend controller enhancement (minimal change)
[HttpGet]
public async Task<ActionResult<PaginatedResponseDto<StudentDto>>> GetStudents(
    [FromQuery] int pageNumber = 1,
    [FromQuery] int pageSize = 10,
    [FromQuery] string? searchString = null,
    [FromQuery] string? sortBy = "lastName",
    [FromQuery] string? sortDirection = "asc")
```

**IMPORTANT CLARIFICATION**: 
Upon review of existing API implementation, if the backend does NOT currently support `sortBy` and `sortDirection` parameters, we have two options:

**Option A: Backend Enhancement (Preferred)**
- Add sort parameters to StudentsController.cs
- Update StudentService to apply sorting in query
- Maintains consistency, enables sorting across all pages
- Small backend change, justified by functional requirement

**Option B: Client-Side Sorting (Fallback)**
- Sort only the current page of results
- Display notice: "Sorting applies to current page only"
- Quick implementation, no backend changes
- Limitation: doesn't sort across all pages

**DECISION**: Prefer Option A (backend enhancement) to meet FR-006 (sortable columns) and SC-002 (sort all students). This is a minor API addition that maintains REST best practices.

**Alternatives Considered**:
1. **Client-side only**: Rejected due to pagination limitation (can't sort across pages)
2. **Fetch all records then sort**: Rejected due to performance (1000 students = unnecessary data transfer)
3. **Separate sorted endpoint**: Rejected due to API complexity (single endpoint with parameters is cleaner)

**Best Practices**:
- Default sort: lastName ASC (alphabetical)
- Secondary sort: When primary sort has ties (e.g., same lastName), sort by firstName
- Validate sortBy parameter (whitelist: lastName, firstName, enrollmentDate, enrollmentCount)
- Return 400 Bad Request for invalid sort parameters

---

## Research Task 3: URL Query Parameter Persistence

### Decision: useQueryParams Custom Hook with React Router

**Rationale**:
- Bookmarkability: Users can save/share filtered/sorted views (FR-028)
- Browser navigation: Back/forward buttons work correctly
- Deep linking: Direct access to specific page/search/sort state
- React Router DOM 7.9.5 provides `useSearchParams` hook (built-in solution)

**Implementation Approach**:
```typescript
// Custom hook: hooks/useQueryParams.ts
import { useSearchParams } from 'react-router-dom';

export function useStudentListParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'lastName';
  const sortDir = searchParams.get('sortDir') || 'asc';
  
  const updateParams = (updates: Partial<ParamState>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) newParams.set(key, value.toString());
      else newParams.delete(key);
    });
    setSearchParams(newParams);
  };
  
  return { page, pageSize, search, sortBy, sortDir, updateParams };
}

// Usage in StudentList.tsx
const { page, pageSize, search, sortBy, sortDir, updateParams } = useStudentListParams();

// Update URL when user searches
const handleSearch = (term: string) => {
  updateParams({ search: term, page: 1 }); // Reset to page 1 on new search
};
```

**Alternatives Considered**:
1. **Local state only**: Rejected because spec requires URL persistence (FR-028)
2. **Hash-based routing**: Rejected because query parameters are more semantic for filters
3. **LocalStorage**: Rejected because it doesn't support bookmarking/sharing

**Best Practices**:
- Reset to page 1 when search/sort changes (avoid invalid page numbers)
- Use shallow routing (don't add every keystroke to history during debounce)
- Validate query parameters (sanitize page numbers, validate sort fields)
- Provide defaults for missing parameters

---

## Research Task 4: Accessible Confirmation Dialogs

### Decision: shadcn/ui Dialog with ARIA Attributes

**Rationale**:
- Existing component: Dialog already installed in project (components/ui/dialog.tsx)
- Radix UI foundation: Built on @radix-ui/react-dialog (accessible by default)
- WCAG 2.1 AA compliant: Focus management, keyboard navigation, screen reader support
- Consistent design: Matches project's design system

**Implementation Approach**:
```typescript
// Component: components/features/StudentDeleteDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface StudentDeleteDialogProps {
  isOpen: boolean;
  studentName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function StudentDeleteDialog({ 
  isOpen, 
  studentName, 
  onConfirm, 
  onCancel 
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
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

**Accessibility Features**:
- **Focus trap**: Focus locked inside dialog (can't tab to background)
- **Escape key**: Closes dialog (Radix UI default behavior)
- **Aria labels**: DialogTitle provides accessible name
- **Descriptive text**: StudentName emphasized for clarity (FR-012)
- **Button variants**: Destructive variant (red) for delete, outline for cancel
- **Keyboard navigation**: Tab cycles through Cancel → Delete buttons

**Alternatives Considered**:
1. **window.confirm()**: Rejected because not customizable, poor UX, not accessible
2. **Custom modal**: Rejected because shadcn/ui Dialog already meets all requirements
3. **Toast notification**: Rejected because deletion requires explicit confirmation

**Best Practices**:
- Always show student name in confirmation text (prevent accidental deletion)
- Use destructive button variant for delete action (visual warning)
- Focus "Cancel" button by default (safe default action)
- Disable buttons during deletion API call (prevent double-click)

---

## Research Task 5: Sortable Table Headers with Visual Indicators

### Decision: Clickable TableHead with lucide-react Icons

**Rationale**:
- Existing icons: lucide-react already installed (used throughout project)
- Visual clarity: Arrow icons (ArrowUp, ArrowDown, ArrowUpDown) show sort state
- Accessibility: Button role + ARIA attributes for screen readers
- Hover feedback: Cursor pointer + hover state indicates clickability

**Implementation Approach**:
```typescript
// Component: Sortable table header
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SortableHeaderProps {
  column: string;
  label: string;
  currentSort: string;
  currentDirection: 'asc' | 'desc';
  onSort: (column: string) => void;
}

function SortableHeader({ column, label, currentSort, currentDirection, onSort }: SortableHeaderProps) {
  const isSorted = currentSort === column;
  
  return (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => onSort(column)}
        className="h-8 px-2 lg:px-3"
        aria-label={`Sort by ${label} ${isSorted ? (currentDirection === 'asc' ? 'descending' : 'ascending') : ''}`}
      >
        {label}
        {isSorted ? (
          currentDirection === 'asc' ? (
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

**Visual States**:
- **Unsorted**: ArrowUpDown icon (opacity 50%, neutral state)
- **Sorted ascending**: ArrowUp icon (full opacity, blue color)
- **Sorted descending**: ArrowDown icon (full opacity, blue color)
- **Hover**: Background color change, cursor pointer

**Alternatives Considered**:
1. **Text indicators**: Rejected because icons are more visual and space-efficient
2. **Separate sort buttons**: Rejected because clicking header is more intuitive
3. **Custom SVG icons**: Rejected because lucide-react provides consistent iconography

**Best Practices**:
- aria-label describes current sort state and next action
- aria-hidden on icons (screen readers use button label)
- Visual feedback on hover (background highlight)
- Toggle behavior: Click same header flips direction (FR-007)

---

## Research Task 6: Enhanced Pagination Controls

### Decision: Modified Pagination Component with Page Jumping and Size Selector

**Rationale**:
- Existing component: Pagination.tsx already exists (components/common/Pagination.tsx)
- Enhancement approach: Add page number buttons + page size dropdown
- Maintains consistency: Uses same shadcn/ui Button and Select components
- Scalability: Shows page numbers with ellipsis for large page counts (1...5,6,7...20)

**Implementation Approach**:
```typescript
// Enhanced Pagination.tsx
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export function Pagination({ currentPage, totalPages, pageSize, onPageChange, onPageSizeChange, hasPrevious, hasNext }: PaginationProps) {
  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showMax = 7; // Max page buttons to show
    
    if (totalPages <= showMax) {
      // Show all pages
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Always show first page, last page, and pages around current
    pages.push(1);
    if (currentPage > 3) pages.push('ellipsis');
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    
    if (currentPage < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);
    
    return pages;
  };
  
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Page size selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Rows per page:</span>
        <Select value={pageSize.toString()} onValueChange={(val) => onPageSizeChange(parseInt(val))}>
          <SelectTrigger className="w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Page navigation */}
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={() => onPageChange(1)} disabled={!hasPrevious}>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={!hasPrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {getPageNumbers().map((page, idx) => 
          page === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="px-2">...</span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          )
        )}
        
        <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={!hasNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onPageChange(totalPages)} disabled={!hasNext}>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
```

**Page Number Display Logic**:
- **Few pages (≤7)**: Show all page numbers (1, 2, 3, 4, 5, 6, 7)
- **Many pages**: Show first, last, current ± 1, with ellipsis (1 ... 5, 6, 7 ... 20)
- **Current page**: Highlighted with primary button variant
- **First/last buttons**: Double chevron icons (ChevronsLeft, ChevronsRight)

**Alternatives Considered**:
1. **Simple prev/next only**: Rejected because spec requires page jumping (FR-016)
2. **Input field for page number**: Rejected because button-based navigation is more user-friendly
3. **Infinite scroll**: Rejected because incompatible with pagination requirement

**Best Practices**:
- Disable first/previous when on first page
- Disable last/next when on last page
- Reset to page 1 when page size changes (avoid invalid page numbers)
- Show current page prominently (variant="default", others variant="outline")
- Keyboard accessible (all buttons tabbable)

---

## Research Task 7: Responsive Design for Mobile/Tablet

### Decision: Tailwind Responsive Utilities with Conditional Rendering

**Rationale**:
- Tailwind CSS 4.x provides mobile-first breakpoints (sm: 640px, md: 768px, lg: 1024px)
- Conditional rendering: Hide less critical columns on small screens
- Horizontal scroll: Use scrollable table container for mobile
- Stack actions: Action buttons stack vertically on small screens

**Implementation Approach**:
```typescript
// Responsive table structure
<div className="overflow-x-auto"> {/* Horizontal scroll on mobile */}
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Last Name</TableHead>
        <TableHead className="hidden md:table-cell">First Name</TableHead> {/* Hide on mobile */}
        <TableHead className="hidden lg:table-cell">Enrollment Date</TableHead> {/* Hide on mobile/tablet */}
        <TableHead className="hidden lg:table-cell">Enrollments</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {students.map(student => (
        <TableRow key={student.id}>
          <TableCell className="font-medium">
            {student.lastName}
            <span className="block md:hidden text-sm text-muted-foreground">
              {student.firstMidName} {/* Show first name under last name on mobile */}
            </span>
          </TableCell>
          <TableCell className="hidden md:table-cell">{student.firstMidName}</TableCell>
          <TableCell className="hidden lg:table-cell">{formatDate(student.enrollmentDate)}</TableCell>
          <TableCell className="hidden lg:table-cell">{student.enrollmentCount}</TableCell>
          <TableCell className="text-right">
            <div className="flex flex-col sm:flex-row justify-end gap-2"> {/* Stack on mobile, row on desktop */}
              <Button size="sm" variant="ghost" asChild>
                <Link to={`/students/${student.id}`}>Details</Link>
              </Button>
              {/* Other buttons... */}
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>

// Responsive pagination
<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
  {/* Page size selector and navigation adapt to screen size */}
</div>
```

**Breakpoint Strategy**:
- **Mobile (< 640px)**: Last Name + Actions only, first name shown below last name
- **Tablet (640px-1023px)**: Last Name, First Name, Actions
- **Desktop (≥ 1024px)**: All columns visible

**Alternatives Considered**:
1. **Separate mobile component**: Rejected due to code duplication and maintenance burden
2. **Card layout on mobile**: Rejected because table structure is more appropriate for data lists
3. **Always show all columns**: Rejected because causes horizontal crowding on mobile

**Best Practices**:
- Use `overflow-x-auto` for horizontal scroll fallback
- Conditional rendering with `hidden md:table-cell` (Tailwind utility)
- Stack action buttons vertically on mobile (`flex-col sm:flex-row`)
- Touch-friendly button sizes (min 44x44px touch target)

---

## Research Task 8: Performance Optimization Strategies

### Decision: React Memoization (useMemo, useCallback, React.memo)

**Rationale**:
- Prevent unnecessary re-renders of table rows (1000 students = expensive)
- Memoize sort/filter functions (stable references prevent useEffect re-runs)
- React.memo for row components (only re-render when student data changes)
- useMemo for computed values (filtered/sorted data)

**Implementation Approach**:
```typescript
// Memoized student row component
const StudentRow = React.memo(({ student, onDelete }: { student: Student; onDelete: (id: number, name: string) => void }) => {
  return (
    <TableRow>
      {/* Row content */}
    </TableRow>
  );
});

// In StudentList.tsx
const sortedStudents = useMemo(() => {
  return [...students].sort((a, b) => {
    // Sorting logic
  });
}, [students, sortBy, sortDirection]);

const handleDelete = useCallback((id: number, name: string) => {
  // Delete logic
}, [/* dependencies */]);

// Debounced search (covered in Research Task 1)
const debouncedSearch = useDebounce(searchTerm, 400);
```

**Optimization Techniques**:
1. **useMemo**: Cache sorted/filtered results (avoid re-sorting on every render)
2. **useCallback**: Stable function references (prevent child re-renders)
3. **React.memo**: Memoize row components (only re-render if props change)
4. **Debouncing**: Reduce API calls during typing (300-500ms delay)
5. **Pagination**: Limit rendered rows (max 100 per page)

**Alternatives Considered**:
1. **Virtualization (react-window)**: Rejected because pagination already limits rows
2. **Web Workers**: Rejected because sorting/filtering is fast enough in main thread
3. **Code splitting**: Rejected because StudentList is a core page (not lazy-loaded)

**Best Practices**:
- Profile with React DevTools before optimizing (measure, don't guess)
- Use React.memo for list items (students rows)
- Memoize callbacks passed to child components
- Avoid inline functions in JSX (use useCallback)
- Monitor bundle size (avoid unnecessary dependencies)

---

## Summary of Key Decisions

| Aspect | Decision | Justification |
|--------|----------|---------------|
| **Search** | Debounced input (400ms) with custom hook | Reduces API calls, standard UX pattern |
| **Sorting** | Server-side with API parameters | Scalable, works with pagination, sorts all records |
| **URL Persistence** | useSearchParams hook from React Router | Bookmarkability, browser navigation support |
| **Confirmation Dialog** | shadcn/ui Dialog component | Already installed, accessible, consistent design |
| **Sortable Headers** | Clickable TableHead with lucide-react icons | Visual clarity, accessibility, standard pattern |
| **Pagination** | Enhanced with page numbers + size selector | User-friendly, supports large datasets |
| **Responsive Design** | Tailwind utilities + conditional rendering | Mobile-first, works 320px-2560px |
| **Performance** | useMemo, useCallback, React.memo | Prevents unnecessary re-renders |

---

## Technology Stack Summary

**No new dependencies required.** All enhancements use existing project technologies:

- **Frontend**: React 19.2.0, TypeScript 5.9.3, Vite 7.2.2
- **UI Components**: shadcn/ui (Button, Input, Dialog, Select, Table)
- **Icons**: lucide-react 0.553.0 (ArrowUp, ArrowDown, Search, X, etc.)
- **Styling**: Tailwind CSS 4.1.17 (semantic colors, responsive utilities)
- **Routing**: React Router DOM 7.9.5 (useSearchParams for query params)
- **HTTP Client**: Axios 1.13.2 (existing studentService.ts)
- **Backend**: ASP.NET Core .NET 9.0 (minor API enhancement for sorting)

---

## Next Steps

Phase 0 complete. Proceed to Phase 1:
1. Generate data-model.md (UI state models)
2. Generate API contracts (enhanced endpoint specification)
3. Generate quickstart.md (developer onboarding guide)
4. Update agent context (Copilot instructions)

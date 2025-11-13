# Phase 1: Design Tokens and Component Inventory

**Feature**: Tailwind CSS and shadcn/ui Design System Setup  
**Date**: November 12, 2025  
**Status**: Complete

## Overview

This document defines the design token structure and provides a complete inventory of UI components in the Contoso University design system. While this is not a traditional "data model" (no database entities), it documents the structure of design values and component APIs that form the foundation of the visual system.

## Design Token Structure

Design tokens are the atomic design decisions (colors, spacing, typography) that define the visual language. These are implemented as CSS variables for runtime flexibility and Tailwind configuration for compile-time utilities.

### Color System

**Base Colors** (Semantic CSS Variables):

| Token Name                 | HSL Value           | Usage                   | Example         |
| -------------------------- | ------------------- | ----------------------- | --------------- |
| `--background`             | `0 0% 100%`         | Page background         | White           |
| `--foreground`             | `222.2 84% 4.9%`    | Primary text color      | Near black      |
| `--card`                   | `0 0% 100%`         | Card backgrounds        | White           |
| `--card-foreground`        | `222.2 84% 4.9%`    | Text on cards           | Near black      |
| `--popover`                | `0 0% 100%`         | Dropdown/popover bg     | White           |
| `--popover-foreground`     | `222.2 84% 4.9%`    | Dropdown text           | Near black      |
| `--primary`                | `222.2 47.4% 11.2%` | Primary actions         | Dark blue       |
| `--primary-foreground`     | `210 40% 98%`       | Text on primary         | Off-white       |
| `--secondary`              | `210 40% 96.1%`     | Secondary actions       | Light blue-gray |
| `--secondary-foreground`   | `222.2 47.4% 11.2%` | Text on secondary       | Dark blue       |
| `--muted`                  | `210 40% 96.1%`     | Disabled/muted elements | Light gray      |
| `--muted-foreground`       | `215.4 16.3% 46.9%` | Muted text              | Medium gray     |
| `--accent`                 | `210 40% 96.1%`     | Accent highlights       | Light blue      |
| `--accent-foreground`      | `222.2 47.4% 11.2%` | Text on accent          | Dark blue       |
| `--destructive`            | `0 84.2% 60.2%`     | Destructive actions     | Red             |
| `--destructive-foreground` | `210 40% 98%`       | Text on destructive     | Off-white       |
| `--border`                 | `214.3 31.8% 91.4%` | Border color            | Light gray      |
| `--input`                  | `214.3 31.8% 91.4%` | Input borders           | Light gray      |
| `--ring`                   | `222.2 84% 4.9%`    | Focus ring color        | Dark blue       |
| `--radius`                 | `0.5rem`            | Border radius           | 8px             |

**State Colors** (Feedback):

| Purpose | Token                       | Color     | Usage Example           |
| ------- | --------------------------- | --------- | ----------------------- |
| Success | Implicit via semantic usage | Green-ish | Form submission success |
| Warning | Via `--accent` with context | Amber-ish | Warning messages        |
| Error   | `--destructive`             | Red       | Form validation errors  |
| Info    | Via `--primary`             | Blue      | Informational messages  |

**Neutral Scale** (Slate base):

| Shade | Tailwind Class | HSL Equivalent      | Usage             |
| ----- | -------------- | ------------------- | ----------------- |
| 50    | `slate-50`     | `210 40% 98%`       | Light backgrounds |
| 100   | `slate-100`    | `210 40% 96.1%`     | Hover states      |
| 200   | `slate-200`    | `214.3 31.8% 91.4%` | Borders           |
| 300   | `slate-300`    | -                   | Disabled elements |
| 400   | `slate-400`    | -                   | Placeholders      |
| 500   | `slate-500`    | `215.4 16.3% 46.9%` | Secondary text    |
| 600   | `slate-600`    | -                   | Primary text      |
| 700   | `slate-700`    | -                   | Headings          |
| 800   | `slate-800`    | -                   | Strong emphasis   |
| 900   | `slate-900`    | `222.2 84% 4.9%`    | Maximum contrast  |
| 950   | `slate-950`    | `222.2 47.4% 11.2%` | Near black        |

### Typography System

**Font Families**:

| Purpose        | Font Stack | Fallback                                                                         |
| -------------- | ---------- | -------------------------------------------------------------------------------- |
| Sans (default) | System UI  | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial` |
| Serif          | Georgia    | `Cambria, "Times New Roman", Times, serif`                                       |
| Mono           | Consolas   | `Monaco, "Courier New", monospace`                                               |

**Font Sizes** (with line heights):

| Token       | Size            | Line Height | Usage                   |
| ----------- | --------------- | ----------- | ----------------------- |
| `text-xs`   | 0.75rem (12px)  | 1rem        | Captions, labels        |
| `text-sm`   | 0.875rem (14px) | 1.25rem     | Small text, table cells |
| `text-base` | 1rem (16px)     | 1.5rem      | Body text (default)     |
| `text-lg`   | 1.125rem (18px) | 1.75rem     | Large body text         |
| `text-xl`   | 1.25rem (20px)  | 1.75rem     | Section headings        |
| `text-2xl`  | 1.5rem (24px)   | 2rem        | Page titles             |
| `text-3xl`  | 1.875rem (30px) | 2.25rem     | Major headings          |
| `text-4xl`  | 2.25rem (36px)  | 2.5rem      | Hero text               |

**Font Weights**:

| Token           | Weight | Usage           |
| --------------- | ------ | --------------- |
| `font-normal`   | 400    | Body text       |
| `font-medium`   | 500    | Emphasized text |
| `font-semibold` | 600    | Subheadings     |
| `font-bold`     | 700    | Headings        |

### Spacing System

**Scale** (Tailwind default, 0.25rem increments):

| Token | Size           | Usage               |
| ----- | -------------- | ------------------- |
| `0`   | 0px            | No spacing          |
| `px`  | 1px            | Borders             |
| `0.5` | 0.125rem (2px) | Micro adjustments   |
| `1`   | 0.25rem (4px)  | Tight spacing       |
| `2`   | 0.5rem (8px)   | Standard spacing    |
| `3`   | 0.75rem (12px) | Medium spacing      |
| `4`   | 1rem (16px)    | Default padding     |
| `5`   | 1.25rem (20px) | Comfortable spacing |
| `6`   | 1.5rem (24px)  | Section spacing     |
| `8`   | 2rem (32px)    | Large spacing       |
| `10`  | 2.5rem (40px)  | Extra large         |
| `12`  | 3rem (48px)    | Section dividers    |
| `16`  | 4rem (64px)    | Hero spacing        |

### Shadow System

| Token       | Value          | Usage            |
| ----------- | -------------- | ---------------- |
| `shadow-sm` | Small shadow   | Subtle elevation |
| `shadow`    | Default shadow | Cards, buttons   |
| `shadow-md` | Medium shadow  | Popovers         |
| `shadow-lg` | Large shadow   | Modals           |
| `shadow-xl` | Extra large    | Overlays         |

### Border Radius

| Token          | Size           | Usage                    |
| -------------- | -------------- | ------------------------ |
| `rounded-sm`   | 0.125rem (2px) | Subtle rounding          |
| `rounded`      | 0.25rem (4px)  | Small elements           |
| `rounded-md`   | 0.375rem (6px) | Medium elements          |
| `rounded-lg`   | 0.5rem (8px)   | Large elements (default) |
| `rounded-xl`   | 0.75rem (12px) | Cards                    |
| `rounded-full` | 9999px         | Circular elements        |

### Responsive Breakpoints

| Breakpoint | Min Width | Target Devices               |
| ---------- | --------- | ---------------------------- |
| `sm`       | 640px     | Large phones (landscape)     |
| `md`       | 768px     | Tablets (portrait)           |
| `lg`       | 1024px    | Tablets (landscape), laptops |
| `xl`       | 1280px    | Desktops                     |
| `2xl`      | 1536px    | Large desktops               |

## Component Inventory

### Core UI Components (shadcn/ui)

These components are installed via the shadcn/ui CLI and located in `src/components/ui/`.

#### 1. Button

**Location**: `src/components/ui/button.tsx`

**Variants**:
| Variant | Appearance | Usage |
|---------|------------|-------|
| `default` | Primary blue background | Primary actions (Create, Save, Submit) |
| `destructive` | Red background | Destructive actions (Delete, Remove) |
| `outline` | Transparent with border | Secondary actions (Cancel, Back) |
| `secondary` | Light gray background | Tertiary actions |
| `ghost` | Transparent, hover effect | Icon buttons, navigation |
| `link` | Text with underline | Inline links, subtle actions |

**Sizes**:

- `sm`: Small (tight padding)
- `default`: Standard
- `lg`: Large (more prominent)

**Props**:

```typescript
interface ButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean; // Render as child component
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}
```

**Example**:

```tsx
<Button variant="default" size="default">Create Student</Button>
<Button variant="destructive" size="sm">Delete</Button>
<Button variant="outline">Cancel</Button>
```

---

#### 2. Input

**Location**: `src/components/ui/input.tsx`

**States**:

- Default
- Focused (ring visible)
- Disabled (muted appearance)
- Error (via surrounding context, not built-in)

**Props**:

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}
```

**Example**:

```tsx
<Input
  type="text"
  placeholder="Search by name..."
  value={searchInput}
  onChange={(e) => setSearchInput(e.target.value)}
/>
```

---

#### 3. Label

**Location**: `src/components/ui/label.tsx`

**Purpose**: Accessible form labels associated with inputs

**Props**:

```typescript
interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
}
```

**Example**:

```tsx
<Label htmlFor="firstName">First Name</Label>
<Input id="firstName" />
```

---

#### 4. Card

**Location**: `src/components/ui/card.tsx`

**Sub-components**:

- `Card`: Container
- `CardHeader`: Top section with title
- `CardTitle`: Heading text
- `CardDescription`: Subtitle text
- `CardContent`: Main content area
- `CardFooter`: Bottom section with actions

**Structure**:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Student Details</CardTitle>
    <CardDescription>View student information</CardDescription>
  </CardHeader>
  <CardContent>{/* Main content */}</CardContent>
  <CardFooter>
    <Button>Edit</Button>
  </CardFooter>
</Card>
```

---

#### 5. Table

**Location**: `src/components/ui/table.tsx`

**Sub-components**:

- `Table`: Container with responsive wrapper
- `TableHeader`: `<thead>` equivalent
- `TableBody`: `<tbody>` equivalent
- `TableFooter`: `<tfoot>` equivalent
- `TableRow`: `<tr>` equivalent
- `TableHead`: `<th>` equivalent (header cells)
- `TableCell`: `<td>` equivalent (data cells)
- `TableCaption`: Accessible table description

**Example**:

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Enrollment Date</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {students.map((student) => (
      <TableRow key={student.id}>
        <TableCell>{student.fullName}</TableCell>
        <TableCell>{student.enrollmentDate}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

#### 6. Select

**Location**: `src/components/ui/select.tsx`

**Sub-components**:

- `Select`: Root container
- `SelectTrigger`: Button that opens dropdown
- `SelectValue`: Displays selected value
- `SelectContent`: Dropdown panel
- `SelectItem`: Individual option

**Example**:

```tsx
<Select value={pageSize} onValueChange={setPageSize}>
  <SelectTrigger>
    <SelectValue placeholder="Page size" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="10">10 per page</SelectItem>
    <SelectItem value="25">25 per page</SelectItem>
    <SelectItem value="50">50 per page</SelectItem>
  </SelectContent>
</Select>
```

---

#### 7. Form

**Location**: `src/components/ui/form.tsx`

**Dependencies**: Requires `react-hook-form` and `zod`

**Sub-components**:

- `Form`: Root provider
- `FormField`: Controlled field wrapper
- `FormItem`: Field container
- `FormLabel`: Field label
- `FormControl`: Input wrapper
- `FormDescription`: Help text
- `FormMessage`: Error message

**Example**:

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="firstName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>First Name</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

---

#### 8. Dialog

**Location**: `src/components/ui/dialog.tsx`

**Sub-components**:

- `Dialog`: Root container (controlled or uncontrolled)
- `DialogTrigger`: Button to open dialog
- `DialogContent`: Modal content panel
- `DialogHeader`: Top section
- `DialogTitle`: Heading
- `DialogDescription`: Subtitle
- `DialogFooter`: Bottom actions

**Example**:

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete this student?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Layout Components (Custom)

These components are created manually for the application structure.

#### 9. AppLayout

**Location**: `src/components/layout/AppLayout.tsx`

**Purpose**: Wraps all pages with consistent navigation and structure

**Structure**:

```tsx
interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
```

**Responsibilities**:

- Render top navigation
- Provide container constraints (max-width)
- Apply consistent padding
- Set minimum height to fill viewport

---

#### 10. Navigation

**Location**: `src/components/layout/Navigation.tsx`

**Purpose**: Top navigation bar with logo and links

**Structure**:

```tsx
export function Navigation() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            Contoso University
          </Link>
          <div className="space-x-4">
            <Link to="/students">Students</Link>
            <Link to="/courses">Courses</Link>
            <Link to="/instructors">Instructors</Link>
            <Link to="/departments">Departments</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

**Features**:

- Horizontal layout
- Logo/brand on left
- Navigation links on right
- Mobile responsive (collapsible menu - future enhancement)
- Active link highlighting (future enhancement)

---

### Utility Components (Refactored)

These existing components will be updated to use the design system.

#### 11. LoadingSpinner (Updated)

**Location**: `src/components/common/LoadingSpinner.tsx`

**Before**:

```tsx
<div className="flex justify-center items-center min-h-[200px]">
  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
</div>
```

**After** (with design system):

```tsx
<div className="flex justify-center items-center min-h-[200px]">
  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
</div>
```

---

#### 12. ErrorMessage (Updated)

**Location**: `src/components/common/ErrorMessage.tsx`

**After** (using Alert component - future):

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>{message}</AlertDescription>
</Alert>;
```

---

#### 13. Pagination (Updated)

**Location**: `src/components/common/Pagination.tsx`

**After** (using Button component):

```tsx
<div className="flex items-center justify-center gap-2">
  <Button
    variant="outline"
    size="sm"
    disabled={!hasPrevious}
    onClick={() => onPageChange(currentPage - 1)}
  >
    Previous
  </Button>

  <span className="text-sm text-muted-foreground">
    Page {currentPage} of {totalPages}
  </span>

  <Button
    variant="outline"
    size="sm"
    disabled={!hasNext}
    onClick={() => onPageChange(currentPage + 1)}
  >
    Next
  </Button>
</div>
```

---

## Component Dependency Graph

```
AppLayout
├── Navigation
└── {Page Content}
    ├── Button
    ├── Input
    ├── Card
    │   ├── CardHeader
    │   │   ├── CardTitle
    │   │   └── CardDescription
    │   ├── CardContent
    │   └── CardFooter
    ├── Table
    │   ├── TableHeader
    │   │   └── TableRow
    │   │       └── TableHead
    │   └── TableBody
    │       └── TableRow
    │           └── TableCell
    ├── Select
    │   ├── SelectTrigger
    │   │   └── SelectValue
    │   └── SelectContent
    │       └── SelectItem
    ├── Form
    │   └── FormField
    │       ├── FormItem
    │       ├── FormLabel
    │       ├── FormControl (wraps Input)
    │       └── FormMessage
    └── Dialog
        ├── DialogTrigger
        └── DialogContent
            ├── DialogHeader
            │   ├── DialogTitle
            │   └── DialogDescription
            └── DialogFooter
```

## Component Usage Matrix

| Component | Students List | Create Student | Edit Student | Student Details |
| --------- | ------------- | -------------- | ------------ | --------------- |
| Button    | ✅            | ✅             | ✅           | ✅              |
| Input     | ✅ (search)   | ✅ (form)      | ✅ (form)    | ❌              |
| Label     | ❌            | ✅ (form)      | ✅ (form)    | ❌              |
| Card      | Optional      | ✅             | ✅           | ✅              |
| Table     | ✅            | ❌             | ❌           | Optional        |
| Select    | Future        | Future         | Future       | ❌              |
| Form      | ❌            | Future         | Future       | ❌              |
| Dialog    | ✅ (delete)   | ❌             | ❌           | ❌              |

**Legend**:

- ✅ : Used in current implementation
- Future: Planned for future enhancement
- Optional: Could enhance UX but not required
- ❌ : Not applicable

## Styling Utilities

### cn() Helper Function

**Location**: `src/lib/utils.ts`

**Purpose**: Merge Tailwind classes intelligently, handling conflicts

**Implementation**:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Usage**:

```typescript
// Without cn()
className="bg-blue-500 hover:bg-blue-700 bg-red-500" // Conflict!

// With cn()
className={cn("bg-blue-500 hover:bg-blue-700", isError && "bg-red-500")}
// Result: "hover:bg-blue-700 bg-red-500" (last bg wins)
```

### Component Variant Patterns

Using `class-variance-authority` (CVA):

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

## Conclusion

This document provides a complete reference for:

- ✅ Design tokens (colors, typography, spacing, etc.)
- ✅ Component inventory (8 shadcn/ui components + 2 layout components)
- ✅ Component APIs and usage examples
- ✅ Styling utilities and patterns
- ✅ Component dependencies and relationships

**Next Steps**: Generate quickstart.md with practical implementation guide and examples.

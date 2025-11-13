# Quickstart Guide: Tailwind CSS and shadcn/ui Design System

**Feature**: 003-tailwind-shadcn-setup  
**For**: Developers implementing or using the Contoso University design system  
**Last Updated**: November 12, 2025

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Using Components](#using-components)
4. [Styling Patterns](#styling-patterns)
5. [Common Patterns](#common-patterns)
6. [Troubleshooting](#troubleshooting)

---

## Installation

### Prerequisites

- Node.js 18+ installed
- Existing React + Vite + TypeScript project (Contoso University frontend)
- Terminal access (Command Prompt, PowerShell, or zsh)

### Step 1: Install Core Dependencies

```bash
cd contoso-university-ui
npm install -D @types/node
npm install tailwindcss @tailwindcss/vite
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
```

**What each package does**:

- `@types/node`: TypeScript types for Node.js (needed for path resolution in Vite config)
- `tailwindcss` + `@tailwindcss/vite`: Tailwind CSS v4 with Vite integration
- `class-variance-authority`: Component variant management (used by shadcn/ui)
- `clsx` + `tailwind-merge`: Utility for merging CSS classes intelligently
- `lucide-react`: Icon library used by shadcn/ui components

### Step 2: Configure TypeScript Paths

**Edit `tsconfig.json`** - Add `compilerOptions.baseUrl` and `compilerOptions.paths`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Also edit `tsconfig.app.json`** - Add the same paths configuration:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    // ... existing config ...
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Step 3: Configure Vite

**Edit `vite.config.ts`**:

```typescript
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add Tailwind CSS plugin
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Path alias for @/ imports
    },
  },
});
```

### Step 4: Initialize shadcn/ui

Run the interactive CLI to create `components.json`:

```bash
npx shadcn@latest init
```

**Answer the prompts**:

```
Would you like to use TypeScript (recommended)? › yes
Which style would you like to use? › New York
Which color would you like to use as base color? › Slate
Where is your global CSS file? › src/styles/globals.css
Would you like to use CSS variables for theming? › yes
Where is your tailwind.config.js located? › tailwind.config.ts
Configure the import alias for components: › @/components
Configure the import alias for utils: › @/lib/utils
Are you using React Server Components? › no
```

This creates:

- `components.json` (shadcn/ui configuration)
- `tailwind.config.ts` (Tailwind configuration with theme)
- `src/lib/utils.ts` (cn() helper function)
- Updates `src/styles/globals.css` with Tailwind directives

### Step 5: Install Components

Install all required components in one go:

```bash
npx shadcn@latest add button input label card table select form dialog
```

Or install individually:

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add select
npx shadcn@latest add form
npx shadcn@latest add dialog
```

Each command creates a new file in `src/components/ui/` (e.g., `button.tsx`, `input.tsx`).

### Step 6: Create Global CSS (if not exists)

**Create or update `src/styles/globals.css`**:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**Import in `src/main.tsx`**:

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/globals.css"; // Add this import

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Step 7: Verify Installation

Start the dev server:

```bash
npm run dev
```

If no errors, you're ready to use the design system! ✅

---

## Configuration

### Customizing Theme Colors

Edit `src/styles/globals.css` to change colors:

```css
:root {
  --primary: 210 100% 50%; /* Change primary color to bright blue */
  --primary-foreground: 0 0% 100%; /* White text on primary */
}
```

All components using `bg-primary` and `text-primary-foreground` will update automatically.

### Adding Custom Tailwind Utilities

Edit `tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      // Add custom spacing
      spacing: {
        "128": "32rem",
      },
      // Add custom colors
      colors: {
        "contoso-blue": "#003366",
      },
    },
  },
};
```

### Changing Border Radius Globally

Edit CSS variables in `globals.css`:

```css
:root {
  --radius: 0.75rem; /* Increase to 12px for rounder corners */
}
```

---

## Using Components

### Button Component

**Basic Usage**:

```tsx
import { Button } from "@/components/ui/button";

<Button>Click Me</Button>;
```

**With Variants**:

```tsx
<Button variant="default">Primary Action</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Subtle</Button>
<Button variant="link">Link Style</Button>
```

**With Sizes**:

```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><PlusIcon /></Button>
```

**With Icons** (using lucide-react):

```tsx
import { Plus } from "lucide-react";

<Button>
  <Plus className="mr-2 h-4 w-4" />
  Create New
</Button>;
```

**As Link** (with React Router):

```tsx
import { Link } from "react-router-dom";

<Button asChild>
  <Link to="/students/create">Create Student</Link>
</Button>;
```

---

### Input Component

**Basic Text Input**:

```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div>
  <Label htmlFor="firstName">First Name</Label>
  <Input id="firstName" type="text" placeholder="Enter first name" />
</div>;
```

**Controlled Input** (with state):

```tsx
const [searchQuery, setSearchQuery] = useState("")

<Input
  type="text"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Search students..."
/>
```

**With Error State** (manually styled):

```tsx
<Input
  className={cn("", hasError && "border-destructive")}
  aria-invalid={hasError}
/>;
{
  hasError && (
    <p className="text-sm text-destructive mt-1">This field is required</p>
  );
}
```

---

### Card Component

**Basic Card**:

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

<Card>
  <CardHeader>
    <CardTitle>Student Profile</CardTitle>
    <CardDescription>View and edit student information</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Name: John Doe</p>
    <p>Email: john@example.com</p>
  </CardContent>
  <CardFooter>
    <Button>Edit Profile</Button>
  </CardFooter>
</Card>;
```

**Card Grid** (responsive):

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

---

### Table Component

**Basic Table**:

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {students.map((student) => (
      <TableRow key={student.id}>
        <TableCell className="font-medium">{student.fullName}</TableCell>
        <TableCell>{student.email}</TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>;
```

**Empty State**:

```tsx
<TableBody>
  {students.length === 0 ? (
    <TableRow>
      <TableCell colSpan={3} className="h-24 text-center">
        No students found.
      </TableCell>
    </TableRow>
  ) : (
    students.map(...)
  )}
</TableBody>
```

---

### Select Component

**Basic Select**:

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<Select value={pageSize} onValueChange={setPageSize}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Items per page" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="10">10 per page</SelectItem>
    <SelectItem value="25">25 per page</SelectItem>
    <SelectItem value="50">50 per page</SelectItem>
  </SelectContent>
</Select>;
```

**With Label**:

```tsx
<div className="space-y-2">
  <Label htmlFor="pageSize">Items per page</Label>
  <Select value={pageSize} onValueChange={setPageSize}>
    <SelectTrigger id="pageSize">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>...</SelectContent>
  </Select>
</div>
```

---

### Dialog Component

**Confirmation Dialog**:

```tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const [open, setOpen] = useState(false)

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button variant="destructive">Delete Student</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete the student record.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
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

### Form Component

**Complete Form Example** (requires `react-hook-form` and `zod`):

First, install dependencies:

```bash
npm install react-hook-form @hookform/resolvers zod
```

Then create a form:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define validation schema
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

function StudentForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Handle form submission
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormDescription>Student's first name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

---

## Styling Patterns

### Using the cn() Utility

The `cn()` function intelligently merges Tailwind classes:

```tsx
import { cn } from "@/lib/utils"

// Without cn() - conflicts not handled
<div className="bg-blue-500 hover:bg-blue-700 bg-red-500">
  {/* bg-red-500 wins but hover:bg-blue-700 remains - inconsistent! */}
</div>

// With cn() - conflicts resolved
<div className={cn(
  "bg-blue-500 hover:bg-blue-700",
  isError && "bg-red-500"
)}>
  {/* Correctly applies bg-red-500 and removes bg-blue-500 when isError */}
</div>
```

**Common Pattern**:

```tsx
<Button
  className={cn(
    "w-full", // Always full width
    isLoading && "opacity-50 cursor-not-allowed" // Conditional styling
  )}
  disabled={isLoading}
>
  {isLoading ? "Loading..." : "Submit"}
</Button>
```

### Responsive Design

Use Tailwind's responsive prefixes:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>

<Button className="w-full sm:w-auto">
  {/* Full width on mobile, auto width on larger screens */}
  Click Me
</Button>
```

### Conditional Styling

```tsx
<Button
  variant={isActive ? "default" : "outline"}
  className={cn("transition-colors", isActive && "ring-2 ring-primary")}
>
  {label}
</Button>
```

---

## Common Patterns

### Page Layout with Navigation

**Create `src/components/layout/AppLayout.tsx`**:

```tsx
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary">
              Contoso University
            </Link>
            <div className="flex gap-6">
              <Link
                to="/students"
                className="hover:text-primary transition-colors"
              >
                Students
              </Link>
              <Link
                to="/courses"
                className="hover:text-primary transition-colors"
              >
                Courses
              </Link>
              <Link
                to="/instructors"
                className="hover:text-primary transition-colors"
              >
                Instructors
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
```

**Use in App.tsx**:

```tsx
import { AppLayout } from "@/components/layout/AppLayout";

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/students" element={<StudentList />} />
        {/* ... other routes */}
      </Routes>
    </AppLayout>
  );
}
```

### Search Bar with Button

```tsx
<div className="flex gap-2">
  <Input
    type="text"
    placeholder="Search..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    className="flex-1"
  />
  <Button onClick={handleSearch}>Search</Button>
  {query && (
    <Button variant="outline" onClick={handleClear}>
      Clear
    </Button>
  )}
</div>
```

### Loading State

```tsx
{
  isLoading ? (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  ) : (
    <div>{/* Content */}</div>
  );
}
```

### Error Message

```tsx
{
  error && (
    <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
      <p className="text-sm text-destructive">{error}</p>
    </div>
  );
}
```

### Empty State

```tsx
<div className="text-center py-12">
  <p className="text-muted-foreground mb-4">No students found</p>
  <Button asChild>
    <Link to="/students/create">Create First Student</Link>
  </Button>
</div>
```

### Action Buttons Group

```tsx
<div className="flex gap-2 justify-end">
  <Button variant="outline" onClick={handleCancel}>
    Cancel
  </Button>
  <Button variant="default" onClick={handleSave}>
    Save
  </Button>
</div>
```

---

## Troubleshooting

### "Cannot find module '@/components/ui/button'"

**Problem**: TypeScript can't resolve the `@/` alias.

**Solution**:

1. Verify `tsconfig.json` has `baseUrl` and `paths` configured
2. Verify `vite.config.ts` has `resolve.alias` configured
3. Restart VS Code / your IDE
4. Restart TypeScript server (VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server")

### "Module '"clsx"' has no exported member 'ClassValue'"

**Problem**: Missing or outdated dependencies.

**Solution**:

```bash
npm install clsx@latest class-variance-authority@latest tailwind-merge@latest
```

### Styles Not Applying

**Problem**: Tailwind CSS not processing classes.

**Solution**:

1. Verify `src/styles/globals.css` is imported in `src/main.tsx`
2. Verify Tailwind directives are in `globals.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
3. Restart dev server: `npm run dev`
4. Clear browser cache (Ctrl/Cmd + Shift + R)

### Components Look Unstyled

**Problem**: CSS variables not applied.

**Solution**:

1. Check `src/styles/globals.css` has `:root { --background: ...; }` variables
2. Verify `globals.css` is imported
3. Check browser DevTools → Elements → Computed styles for CSS variable values

### "path" Module Not Found in vite.config.ts

**Problem**: Missing Node.js types.

**Solution**:

```bash
npm install -D @types/node
```

### Import Autocomplete Not Working

**Problem**: IDE not recognizing path aliases.

**Solution**:

1. Ensure both `tsconfig.json` AND `tsconfig.app.json` have paths configured
2. Restart IDE
3. For VS Code: Reload window (Cmd/Ctrl + Shift + P → "Developer: Reload Window")

### Dark Mode Not Working

**Note**: Dark mode is not configured by default. To add:

1. Install `next-themes` (or create custom context):

   ```bash
   npm install next-themes
   ```

2. Wrap app with ThemeProvider (see shadcn/ui dark mode docs)

3. Add dark mode CSS variables to `globals.css`:
   ```css
   .dark {
     --background: 222.2 84% 4.9%;
     --foreground: 210 40% 98%;
     /* ... other dark mode variables */
   }
   ```

---

## Next Steps

1. **Refactor Students Page**: See `StudentList.tsx` for reference implementation
2. **Create Additional Pages**: Use components to build Courses, Instructors pages
3. **Enhance Forms**: Implement Form component with validation
4. **Add Accessibility**: Test with keyboard navigation and screen readers
5. **Optimize Performance**: Monitor bundle size, implement code splitting if needed

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI (component primitives)](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [React Hook Form](https://react-hook-form.com/)

---

**Questions or Issues?**

Check the [research.md](./research.md) and [data-model.md](./data-model.md) for detailed design decisions and component specifications.

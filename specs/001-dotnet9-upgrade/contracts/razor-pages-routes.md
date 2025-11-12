# API Contracts: .NET 9 Framework Upgrade

**Feature**: 001-dotnet9-upgrade  
**Date**: 2025-11-12  
**Impact**: None - Framework upgrade only

## Overview

This framework upgrade does NOT modify any API contracts, endpoints, or request/response formats. All existing Razor Pages routes, form submissions, and navigation patterns remain unchanged.

## Razor Pages Routes

All page routes remain identical:

### Students
- `GET /Students` - List all students
- `GET /Students/Details?id={id}` - View student details
- `GET /Students/Create` - Display create form
- `POST /Students/Create` - Submit new student
- `GET /Students/Edit?id={id}` - Display edit form
- `POST /Students/Edit?id={id}` - Submit student updates
- `GET /Students/Delete?id={id}` - Display delete confirmation
- `POST /Students/Delete?id={id}` - Confirm deletion

### Courses
- `GET /Courses` - List all courses
- `GET /Courses/Details?id={id}` - View course details
- `GET /Courses/Create` - Display create form
- `POST /Courses/Create` - Submit new course
- `GET /Courses/Edit?id={id}` - Display edit form
- `POST /Courses/Edit?id={id}` - Submit course updates
- `GET /Courses/Delete?id={id}` - Display delete confirmation
- `POST /Courses/Delete?id={id}` - Confirm deletion

### Instructors
- `GET /Instructors` - List all instructors with courses and enrollments
- `GET /Instructors/Details?id={id}` - View instructor details
- `GET /Instructors/Create` - Display create form
- `POST /Instructors/Create` - Submit new instructor
- `GET /Instructors/Edit?id={id}` - Display edit form
- `POST /Instructors/Edit?id={id}` - Submit instructor updates
- `GET /Instructors/Delete?id={id}` - Display delete confirmation
- `POST /Instructors/Delete?id={id}` - Confirm deletion

### Departments
- `GET /Departments` - List all departments
- `GET /Departments/Details?id={id}` - View department details
- `GET /Departments/Create` - Display create form
- `POST /Departments/Create` - Submit new department
- `GET /Departments/Edit?id={id}` - Display edit form with concurrency token
- `POST /Departments/Edit?id={id}` - Submit department updates
- `GET /Departments/Delete?id={id}` - Display delete confirmation
- `POST /Departments/Delete?id={id}` - Confirm deletion

### Other Pages
- `GET /` - Home/Index page
- `GET /About` - About page with enrollment statistics
- `GET /Privacy` - Privacy policy page
- `GET /Error` - Error page

## Form Contracts

All form submissions remain unchanged:

### Example: Create Student Form
```
POST /Students/Create
Content-Type: application/x-www-form-urlencoded

LastName=Smith&FirstMidName=John&EnrollmentDate=2025-09-01
```

### Example: Edit Course Form
```
POST /Courses/Edit?id=1050
Content-Type: application/x-www-form-urlencoded

CourseID=1050&Title=Chemistry&Credits=3&DepartmentID=1
```

### Example: Edit Department (with Concurrency)
```
POST /Departments/Edit?id=1
Content-Type: application/x-www-form-urlencoded

DepartmentID=1&Name=Engineering&Budget=350000&StartDate=2007-09-01&InstructorID=1&RowVersion=AAAAAAAA8gI=
```

## Response Formats

All responses remain HTML (Razor Pages) - no JSON APIs in this application.

### Success Responses
- **HTTP 200 OK**: Page rendered successfully
- **HTTP 302 Found**: Redirect after successful POST (PRG pattern)

### Error Responses
- **HTTP 404 Not Found**: Entity not found
- **HTTP 400 Bad Request**: Validation errors
- **HTTP 500 Internal Server Error**: Unhandled exceptions (redirects to /Error)

## Navigation Patterns

All navigation links remain unchanged:

```html
<!-- Main Navigation -->
<a href="/">Home</a>
<a href="/Students">Students</a>
<a href="/Courses">Courses</a>
<a href="/Instructors">Instructors</a>
<a href="/Departments">Departments</a>
<a href="/About">About</a>

<!-- Entity Actions -->
<a href="/Students/Create">Create New</a>
<a href="/Students/Edit?id=1">Edit</a>
<a href="/Students/Details?id=1">Details</a>
<a href="/Students/Delete?id=1">Delete</a>
```

## Query Parameters

All query string parameters remain unchanged:

### Pagination
- `?pageIndex={number}` - Page number (1-based)

### Sorting
- `?sortOrder={field}` - Sort field and direction

### Filtering
- `?searchString={text}` - Search/filter text

### Entity Selection
- `?id={number}` - Entity primary key
- `?courseID={number}` - Course selection (Instructors index)

## Validation Messages

All validation messages remain unchanged:

### Required Field
```
The LastName field is required.
```

### Data Type Validation
```
The field EnrollmentDate must be a date.
```

### Range Validation
```
The field Credits must be between 0 and 5.
```

### Concurrency Conflict
```
The department was modified by another user. Please review the current values and try again.
```

## Framework Impact Analysis

### ASP.NET Core 9 Compatibility
- **No breaking changes** in routing
- **No breaking changes** in model binding
- **No breaking changes** in validation
- **No breaking changes** in POST-Redirect-GET pattern
- **No breaking changes** in tag helpers
- **No breaking changes** in form generation

### Expected Behavior
All pages should:
- Route to same URLs
- Accept same form data
- Return same HTML structure
- Preserve same validation behavior
- Maintain same error handling
- Keep same navigation patterns

## Testing Verification

After upgrade, verify:

### GET Endpoints
- [ ] All list pages load (Students, Courses, Instructors, Departments)
- [ ] All detail pages load with valid IDs
- [ ] All create forms display
- [ ] All edit forms display with valid IDs
- [ ] All delete confirmations display with valid IDs
- [ ] 404 responses for invalid IDs

### POST Endpoints
- [ ] Create operations succeed with valid data
- [ ] Create operations fail with validation errors for invalid data
- [ ] Edit operations succeed with valid data
- [ ] Edit operations fail with validation errors for invalid data
- [ ] Delete operations succeed
- [ ] Concurrency handling works for Department edits

### Navigation
- [ ] All navigation links work
- [ ] Breadcrumbs and back links work
- [ ] POST-Redirect-GET pattern preserves
- [ ] Search and filter parameters work

## Conclusion

**No API contract changes required for .NET 9 upgrade.** All routes, forms, query parameters, and response formats remain identical. This document confirms full backward compatibility of all user-facing endpoints and navigation patterns.

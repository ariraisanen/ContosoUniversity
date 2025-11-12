# Lab 8: Student Course Registration (Optional)

## Overview

Implement a course registration system allowing students to browse available course offerings and enroll. This builds on the scheduling system from Lab 7 (or works with the basic course system if Lab 7 wasn't completed).

## Learning Objectives

- Build a user-facing registration workflow with Spec-Kit
- Implement shopping cart pattern for course selection
- Handle concurrent registration scenarios
- Manage enrollment constraints and prerequisites
- Use GitHub Copilot for complex business logic

## Prerequisites

- Completed Lab 1 (basic setup)
- GitHub Copilot enabled in your IDE
- Completed Lab 7 (recommended but not required)
- Understanding of the Enrollment entity

## Duration

Approximately 90-120 minutes

---

## Part 1: Planning the Registration System

### Step 1: Create Feature Branch

```bash
git checkout main
git pull
git checkout -b feature/course-registration
```

### Step 2: Create Specification with GitHub Copilot

```
Help me create a detailed specification for a student course registration system.
Save it as specs/008-course-registration/spec.md.

Include:

1. **User Stories**:
   - As a student, I want to browse available courses for a semester
   - As a student, I want to add/remove courses from a registration cart
   - As a student, I want to see if courses conflict with my existing schedule
   - As a student, I want to submit my registration and receive confirmation

2. **Current State**:
   - Enrollment entity exists but basic
   - No registration workflow
   - No validation of conflicts or prerequisites

3. **Features to Implement**:
   - Course catalog browser with filters (department, time, instructor)
   - Shopping cart for selected courses
   - Prerequisites checking
   - Schedule conflict detection
   - Enrollment capacity limits
   - Registration submission and confirmation
   - Drop/swap courses

4. **Business Rules**:
   - Students can't register for conflicting times
   - Must meet prerequisites
   - Can't exceed credit hour limits
   - Registration periods (early, regular, late)
   - Withdrawal deadlines

5. **UI/UX Requirements**:
   - Intuitive course browsing
   - Visual schedule builder
   - Clear error messages
   - Mobile-friendly

6. **Success Criteria**

Follow spec-kit methodology.
```

### Step 3: Research Patterns

```
Research best practices for course registration systems, focusing on:

1. Shopping cart pattern for course selection
2. Optimistic concurrency control (handling simultaneous registrations)
3. Transaction management (all-or-nothing enrollment)
4. Prerequisite graph traversal
5. UX patterns for course selection

Document in specs/008-course-registration/research.md
```

---

## Part 2: Data Model Updates

### Step 1: Update Enrollment Entity

Ask GitHub Copilot:

```
Review and enhance the existing Enrollment entity for the registration system.

Current Enrollment has:
- Student
- Course  
- Grade

I need to add:
- Registration status (Pending, Registered, Dropped, Waitlisted)
- Registration date/time
- Drop date (if applicable)
- Waitlist position (if applicable)

Also create supporting entities:
- Prerequisites (course-to-course relationships)
- RegistrationPeriod (defines when students can register)
- StudentRegistrationCart (temporary storage)

Show me the updated entity models with relationships.
```

### Step 2: Create Migration

```
Help me create a migration for the registration system enhancements.

Include:
- Updated Enrollment table
- New Prerequisite table
- New RegistrationPeriod table
- New RegistrationCart table

Review the migration for correctness before I apply it.
```

```bash
cd ContosoUniversity
dotnet ef migrations add CourseRegistrationSystem
dotnet ef database update
```

---

## Part 3: Business Logic Layer

### Step 1: Registration Service

Ask GitHub Copilot:

```
Create a CourseRegistrationService class with the following methods:

1. Task<List<CourseOffering>> GetAvailableCoursesAsync(int studentId, int semesterId)
   - Returns courses student can register for
   - Excludes already enrolled courses
   - Filters by prerequisites met

2. Task<bool> AddToCartAsync(int studentId, int courseOfferingId)
   - Adds course to student's registration cart
   - Validates prerequisites
   - Checks for time conflicts
   - Checks if course is full

3. Task<bool> RemoveFromCartAsync(int studentId, int courseOfferingId)
   - Removes course from cart

4. Task<RegistrationResult> SubmitRegistrationAsync(int studentId)
   - Registers student for all courses in cart
   - Uses transaction (all or nothing)
   - Handles race conditions (optimistic concurrency)
   - Returns success/failure with details

5. Task<bool> DropCourseAsync(int studentId, int enrollmentId)
   - Allows dropping before deadline
   - Updates enrollment status

Show me the complete service implementation with error handling.
```

### Step 2: Prerequisite Checker

```
Create a PrerequisiteService class that:

1. Checks if a student has met prerequisites for a course
2. Handles AND/OR prerequisite logic (e.g., "CS 101 AND (CS 102 OR CS 103)")
3. Returns clear messages about what's missing
4. Efficiently queries the database

Include:
- Recursive checking for prerequisite chains
- Caching for performance
- Clear error messages

Show me the implementation.
```

---

## Part 4: API Endpoints (If Lab 2 Completed)

### Create Registration API

```
Help me create REST API endpoints for course registration:

GET    /api/registration/available-courses?studentId={id}&semester={id}
POST   /api/registration/cart/add
POST   /api/registration/cart/remove  
GET    /api/registration/cart/{studentId}
POST   /api/registration/submit
DELETE /api/registration/drop/{enrollmentId}
GET    /api/registration/my-schedule/{studentId}

Include:
- Request/response DTOs
- Validation
- Proper HTTP status codes
- Swagger documentation
- Error handling for concurrent registration

Show me the controller implementation.
```

---

## Part 5: Frontend Implementation

### Option A: Razor Pages Implementation

Ask GitHub Copilot:

```
Create Razor Pages for the student registration workflow:

1. Pages/Registration/Browse.cshtml
   - Course catalog with filters (department, time, days)
   - Search functionality
   - Course cards showing: title, instructor, time, seats available
   - "Add to Cart" buttons

2. Pages/Registration/Cart.cshtml
   - List of selected courses
   - Visual schedule (grid showing day/time)
   - Credit hour total
   - Conflict warnings
   - "Remove" buttons
   - "Submit Registration" button

3. Pages/Registration/MySchedule.cshtml
   - Current enrolled courses
   - Calendar view
   - Drop course functionality (if before deadline)

Use the modern UI from Lab 5 if completed. 
Show me the page models and views.
```

### Option B: React Implementation

```
Create React components for course registration:

1. Coursecatalog component
   - Search and filter UI
   - Course list with filtering
   - Add to cart functionality

2. RegistrationCart component
   - Selected courses list
   - Visual schedule grid
   - Conflict detection UI
   - Submit registration flow

3. MySchedule component
   - Calendar view of enrolled courses
   - Course details
   - Drop course functionality

Use shadcn/ui components if Lab 5 completed.
Include proper state management (Context API or zustand).
Show me the component structure and implementation.
```

### Step 2: Visual Schedule Grid

```
Help me create a visual schedule grid component that:

1. Shows a weekly calendar (Monday-Friday, 8 AM - 6 PM)
2. Displays selected courses as blocks in their time slots
3. Highlights conflicts in red
4. Shows tooltips with course details
5. Responsive (switches to list view on mobile)

For React: Use a library like react-big-calendar or build custom
For Razor: Use CSS Grid with server-rendered data

Show me the implementation.
```

---

## Part 6: Validation and Error Handling

### Create Validation Rules

```
Help me implement comprehensive validation for course registration:

1. **Prerequisite Validation**:
   - Check before adding to cart
   - Show clear message: "Requires: CS 101 (not taken)"

2. **Schedule Conflict Validation**:
   - Check against current enrollments
   - Check against other cart items
   - Show conflicts visually

3. **Capacity Validation**:
   - Check if course is full
   - Offer waitlist option

4. **Credit Hour Limits**:
   - Check maximum credits per semester (e.g., 18)
   - Warning at threshold

5. **Registration Period Validation**:
   - Check if registration is open
   - Show open date if not yet open

Show me validation attribute classes or FluentValidation rules.
```

---

## Part 7: Handling Concurrent Registration

### Implement Optimistic Concurrency

Ask GitHub Copilot:

```
When multiple students register for the same course simultaneously, 
I need to handle race conditions properly.

Help me implement:

1. Row version/timestamp on CourseOffering entity
2. Retry logic in SubmitRegistrationAsync
3. Clear error messages when course fills up during registration
4. Automatic waitlist placement if desired

Show me the EF Core configuration and service code to handle this.
```

### Testing Concurrent Scenarios

```
Help me create a test scenario to simulate concurrent registration:

1. Create a course with 1 remaining seat
2. Have 2 students try to register simultaneously
3. Verify only one succeeds
4. Verify the other gets a clear error message

Show me the test code (xUnit or manual testing script).
```

---

## Part 8: Notifications and Confirmation

### Email Confirmation (Optional)

```
Create a notification system for registration events:

1. Registration confirmation email
2. Waitlist notification when space opens
3. Registration period reminders
4. Drop confirmation

Use a notification service pattern with:
- IEmailService interface
- Mock implementation for development
- SendGrid/SMTP implementation for production

Show me the implementation.
```

---

## Part 9: Testing

### Create Test Plan

```
Help me create a test plan (specs/008-course-registration/test-plan.md) covering:

**Functional Tests**:
1. Browse available courses
2. Add course to cart (happy path)
3. Remove course from cart
4. Submit registration successfully
5. Drop a course

**Validation Tests**:
6. Try to add course without prerequisites
7. Try to add conflicting courses
8. Try to register for full course
9. Try to exceed credit limit
10. Try to register outside registration period

**Concurrent Tests**:
11. Multiple students registering for limited seats
12. Course fills up during cart submission

**UI Tests**:
13. Visual schedule displays correctly
14. Conflicts highlighted
15. Mobile responsiveness

Include test data and expected outcomes.
```

### Manual Testing

```bash
dotnet run
```

Walk through complete registration workflow:
1. Log in as a student
2. Browse course catalog
3. Filter by department
4. Add 3-4 courses to cart
5. View visual schedule
6. Remove one course
7. Submit registration
8. Verify confirmation
9. View "My Schedule"
10. Drop a course

---

## Key Takeaways

1. **Complex Workflows**: Registration systems have many interdependent rules
2. **Concurrency**: Must handle simultaneous user actions gracefully  
3. **User Experience**: Clear feedback at every step is critical
4. **Transactions**: All-or-nothing operations prevent partial state
5. **Testing**: Comprehensive testing is essential for user-facing features

## Challenge Extensions

1. **Waitlist Management**: Automatic enrollment from waitlist when space opens
2. **Course Recommendations**: AI-suggested courses based on major/interests
3. **Degree Audit**: Show progress toward degree requirements
4. **Registration Appointments**: Staggered registration by student classification
5. **Add/Drop with Refund**: Financial integration for tuition refunds
6. **Mobile App**: Native mobile registration app

## Troubleshooting

### Concurrent Registration Conflicts

```
Ask GitHub Copilot:
"I'm getting DbUpdateConcurrencyException when multiple students 
register for the same course. Help me implement proper optimistic 
concurrency control with retry logic."
```

### Performance Issues with Large Course Catalogs

```
"The course catalog loads slowly with 1000+ courses. Help me optimize 
with pagination, indexing, and lazy loading."
```

## Resources

- [EF Core Concurrency Handling](https://learn.microsoft.com/ef/core/saving/concurrency)
- [Shopping Cart Pattern](https://learn.microsoft.com/azure/architecture/patterns/shopping-cart)
- [Optimistic Concurrency](https://learn.microsoft.com/ef/core/saving/concurrency)

---

Continue to **Lab 9: Semester View** to create a personalized student schedule view!


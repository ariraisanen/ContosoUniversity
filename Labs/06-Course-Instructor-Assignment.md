# Lab 6: Course-Instructor Assignment (Optional)

## Overview

Add functionality to assign instructors to courses, creating a many-to-many relationship. This allows multiple instructors to teach multiple courses, and courses to have multiple instructors.

## Learning Objectives

- Implement many-to-many relationships in Entity Framework Core
- Create join tables and navigation properties
- Build UI for managing relationships
- Use Spec-Kit for feature development
- Handle data validation and business rules

## Prerequisites

- Completed Lab 1 (basic setup)
- GitHub Copilot enabled in your IDE
- Understanding of Entity Framework relationships
- Completed Lab 2 (optional, for API implementation)

## Duration

Approximately 90-120 minutes

---

## Part 1: Planning with Spec-Kit

### Step 1: Create Feature Branch

```bash
git checkout main
git pull
git checkout -b feature/course-instructor-assignment
```

### Step 2: Create Specification

Create `specs/006-course-instructor-assignment/spec.md`:

```markdown
# Course-Instructor Assignment Feature

## Problem Statement

Currently, the database has a many-to-many relationship between Instructors and Courses
through CourseAssignment, but there's no UI to manage these assignments. We need to:

- View which instructors teach which courses
- Assign instructors to courses
- Remove instructor assignments
- Handle validation and constraints

## Current State

The `CourseAssignment` table exists but is not being used:

- Instructor has `CourseAssignments` navigation property
- Course should have `CourseAssignments` navigation property (needs to be added)
- No UI for managing assignments

## Proposed Solution

### Database Changes

1. Ensure Course model has CourseAssignments navigation property
2. Update migrations if needed

### UI Changes

1. **Courses Index**: Show count of assigned instructors
2. **Course Details**: List assigned instructors with remove option
3. **Course Edit**: Multi-select dropdown to assign instructors
4. **Instructor Details**: Show courses they teach
5. **Instructor Edit**: Multi-select dropdown to assign courses

### Business Rules

- A course can have 0 to many instructors
- An instructor can teach 0 to many courses
- Can't assign the same instructor to a course twice
- Deleting an instructor removes their course assignments
- Deleting a course removes its instructor assignments

## Success Criteria

- [ ] Can view instructor assignments on course pages
- [ ] Can view course assignments on instructor pages
- [ ] Can add instructors to a course
- [ ] Can remove instructors from a course
- [ ] Can add courses to an instructor
- [ ] Can remove courses from an instructor
- [ ] Validation prevents duplicate assignments
- [ ] Cascade deletes work correctly
```

### Step 3: Research Implementation

In GitHub Copilot Chat:

```
Research best practices for implementing many-to-many relationships in Entity Framework Core,
specifically for managing course-instructor assignments. Include examples of handling
join tables and navigation properties. Document your findings in
specs/006-course-instructor-assignment/research.md
```

---

## Part 2: Database Model Updates

### Step 1: Update Course Model

In `Models/Course.cs`, ensure the CourseAssignments navigation exists:

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContosoUniversity.Models
{
    public class Course
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Display(Name = "Number")]
        public int CourseID { get; set; }

        [StringLength(50, MinimumLength = 3)]
        public string Title { get; set; }

        [Range(0, 5)]
        public int Credits { get; set; }

        public int DepartmentID { get; set; }

        public Department Department { get; set; }
        public ICollection<Enrollment> Enrollments { get; set; }
        public ICollection<CourseAssignment> CourseAssignments { get; set; }
    }
}
```

### Step 2: Review CourseAssignment Model

Verify `Models/CourseAssignment.cs` exists with proper structure:

```csharp
namespace ContosoUniversity.Models
{
    public class CourseAssignment
    {
        public int InstructorID { get; set; }
        public int CourseID { get; set; }
        public Instructor Instructor { get; set; }
        public Course Course { get; set; }
    }
}
```

### Step 3: Update DbContext Configuration

In `Data/SchoolContext.cs`, ensure the join table is configured:

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Course>().ToTable("Course");
    modelBuilder.Entity<Enrollment>().ToTable("Enrollment");
    modelBuilder.Entity<Student>().ToTable("Student");
    modelBuilder.Entity<Department>().ToTable("Department");
    modelBuilder.Entity<Instructor>().ToTable("Instructor");
    modelBuilder.Entity<OfficeAssignment>().ToTable("OfficeAssignment");
    modelBuilder.Entity<CourseAssignment>().ToTable("CourseAssignment");

    // Configure composite key for CourseAssignment
    modelBuilder.Entity<CourseAssignment>()
        .HasKey(c => new { c.CourseID, c.InstructorID });

    // Configure relationships
    modelBuilder.Entity<CourseAssignment>()
        .HasOne(ca => ca.Course)
        .WithMany(c => c.CourseAssignments)
        .HasForeignKey(ca => ca.CourseID);

    modelBuilder.Entity<CourseAssignment>()
        .HasOne(ca => ca.Instructor)
        .WithMany(i => i.CourseAssignments)
        .HasForeignKey(ca => ca.InstructorID);
}
```

### Step 4: Create and Apply Migration

```bash
cd ContosoUniversity
dotnet ef migrations add AddCourseInstructorAssignment
dotnet ef database update
```

---

## Part 3: Backend Page Models

### Step 1: Update Course Details Page Model

In `Pages/Courses/Details.cshtml.cs`:

```csharp
public class DetailsModel : PageModel
{
    private readonly SchoolContext _context;

    public DetailsModel(SchoolContext context)
    {
        _context = context;
    }

    public Course Course { get; set; }
    public List<Instructor> AssignedInstructors { get; set; }

    public async Task<IActionResult> OnGetAsync(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        Course = await _context.Courses
            .Include(c => c.Department)
            .Include(c => c.CourseAssignments)
                .ThenInclude(ca => ca.Instructor)
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.CourseID == id);

        if (Course == null)
        {
            return NotFound();
        }

        AssignedInstructors = Course.CourseAssignments
            .Select(ca => ca.Instructor)
            .ToList();

        return Page();
    }
}
```

### Step 2: Update Course Edit Page Model

In `Pages/Courses/Edit.cshtml.cs`:

```csharp
public class EditModel : DepartmentNamePageModel
{
    private readonly SchoolContext _context;

    public EditModel(SchoolContext context)
    {
        _context = context;
    }

    [BindProperty]
    public Course Course { get; set; }

    // For managing instructor assignments
    [BindProperty]
    public List<int> SelectedInstructorIds { get; set; }

    public List<Instructor> AllInstructors { get; set; }
    public HashSet<int> CurrentInstructorIds { get; set; }

    public async Task<IActionResult> OnGetAsync(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        Course = await _context.Courses
            .Include(c => c.Department)
            .Include(c => c.CourseAssignments)
            .FirstOrDefaultAsync(m => m.CourseID == id);

        if (Course == null)
        {
            return NotFound();
        }

        PopulateDepartmentsDropDownList(_context, Course.DepartmentID);

        // Load all instructors
        AllInstructors = await _context.Instructors
            .OrderBy(i => i.LastName)
            .ToListAsync();

        // Get currently assigned instructor IDs
        CurrentInstructorIds = Course.CourseAssignments
            .Select(ca => ca.InstructorID)
            .ToHashSet();

        return Page();
    }

    public async Task<IActionResult> OnPostAsync(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var courseToUpdate = await _context.Courses
            .Include(c => c.CourseAssignments)
            .FirstOrDefaultAsync(c => c.CourseID == id);

        if (courseToUpdate == null)
        {
            return NotFound();
        }

        if (await TryUpdateModelAsync<Course>(
            courseToUpdate,
            "Course",
            c => c.Title, c => c.Credits, c => c.DepartmentID))
        {
            // Update instructor assignments
            UpdateInstructorAssignments(courseToUpdate);

            try
            {
                await _context.SaveChangesAsync();
                return RedirectToPage("./Details", new { id = courseToUpdate.CourseID });
            }
            catch (DbUpdateException ex)
            {
                ModelState.AddModelError("", "Unable to save changes. Try again.");
            }
        }

        PopulateDepartmentsDropDownList(_context, courseToUpdate.DepartmentID);
        AllInstructors = await _context.Instructors.OrderBy(i => i.LastName).ToListAsync();
        CurrentInstructorIds = courseToUpdate.CourseAssignments.Select(ca => ca.InstructorID).ToHashSet();

        return Page();
    }

    private void UpdateInstructorAssignments(Course course)
    {
        // Get current assignments
        var currentAssignments = course.CourseAssignments.ToList();
        var currentInstructorIds = currentAssignments.Select(ca => ca.InstructorID).ToHashSet();

        // Selected instructor IDs (from form)
        var selectedIds = SelectedInstructorIds?.ToHashSet() ?? new HashSet<int>();

        // Remove unselected assignments
        foreach (var assignment in currentAssignments)
        {
            if (!selectedIds.Contains(assignment.InstructorID))
            {
                _context.Remove(assignment);
            }
        }

        // Add new assignments
        foreach (var instructorId in selectedIds)
        {
            if (!currentInstructorIds.Contains(instructorId))
            {
                course.CourseAssignments.Add(new CourseAssignment
                {
                    CourseID = course.CourseID,
                    InstructorID = instructorId
                });
            }
        }
    }
}
```

---

## Part 4: UI Implementation

### Step 1: Update Course Details View

In `Pages/Courses/Details.cshtml`:

```html
@page @model ContosoUniversity.Pages.Courses.DetailsModel @{ ViewData["Title"] =
"Course Details"; }

<h2>Course Details</h2>

<div class="card mb-4">
  <div class="card-body">
    <dl class="row">
      <dt class="col-sm-3">
        @Html.DisplayNameFor(model => model.Course.CourseID)
      </dt>
      <dd class="col-sm-9">@Html.DisplayFor(model => model.Course.CourseID)</dd>

      <dt class="col-sm-3">
        @Html.DisplayNameFor(model => model.Course.Title)
      </dt>
      <dd class="col-sm-9">@Html.DisplayFor(model => model.Course.Title)</dd>

      <dt class="col-sm-3">
        @Html.DisplayNameFor(model => model.Course.Credits)
      </dt>
      <dd class="col-sm-9">@Html.DisplayFor(model => model.Course.Credits)</dd>

      <dt class="col-sm-3">
        @Html.DisplayNameFor(model => model.Course.Department)
      </dt>
      <dd class="col-sm-9">
        @Html.DisplayFor(model => model.Course.Department.Name)
      </dd>
    </dl>
  </div>
</div>

<div class="card">
  <div class="card-header">
    <h4>Assigned Instructors</h4>
  </div>
  <div class="card-body">
    @if (Model.AssignedInstructors.Any()) {
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Hire Date</th>
        </tr>
      </thead>
      <tbody>
        @foreach (var instructor in Model.AssignedInstructors) {
        <tr>
          <td>
            <a asp-page="/Instructors/Details" asp-route-id="@instructor.ID">
              @instructor.FullName
            </a>
          </td>
          <td>@instructor.Email</td>
          <td>@instructor.HireDate.ToShortDateString()</td>
        </tr>
        }
      </tbody>
    </table>
    } else {
    <p class="text-muted">No instructors assigned to this course yet.</p>
    }
  </div>
</div>

<div class="mt-3">
  <a
    asp-page="./Edit"
    asp-route-id="@Model.Course.CourseID"
    class="btn btn-primary"
    >Edit</a
  >
  <a asp-page="./Index" class="btn btn-secondary">Back to List</a>
</div>
```

### Step 2: Update Course Edit View

In `Pages/Courses/Edit.cshtml`:

```html
@page @model ContosoUniversity.Pages.Courses.EditModel @{ ViewData["Title"] =
"Edit Course"; }

<h2>Edit Course</h2>

<form method="post">
  <input type="hidden" asp-for="Course.CourseID" />

  <div class="row">
    <div class="col-md-6">
      <div class="card mb-4">
        <div class="card-header">
          <h4>Course Information</h4>
        </div>
        <div class="card-body">
          <div class="form-group mb-3">
            <label asp-for="Course.Title" class="form-label"></label>
            <input asp-for="Course.Title" class="form-control" />
            <span asp-validation-for="Course.Title" class="text-danger"></span>
          </div>

          <div class="form-group mb-3">
            <label asp-for="Course.Credits" class="form-label"></label>
            <input asp-for="Course.Credits" class="form-control" />
            <span
              asp-validation-for="Course.Credits"
              class="text-danger"
            ></span>
          </div>

          <div class="form-group mb-3">
            <label asp-for="Course.DepartmentID" class="form-label"
              >Department</label
            >
            <select
              asp-for="Course.DepartmentID"
              class="form-control"
              asp-items="ViewBag.DepartmentID"
            >
              <option value="">-- Select Department --</option>
            </select>
            <span
              asp-validation-for="Course.DepartmentID"
              class="text-danger"
            ></span>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-6">
      <div class="card mb-4">
        <div class="card-header">
          <h4>Assign Instructors</h4>
        </div>
        <div class="card-body">
          <div class="instructor-list">
            @foreach (var instructor in Model.AllInstructors) { var isChecked =
            Model.CurrentInstructorIds.Contains(instructor.ID);
            <div class="form-check mb-2">
              <input class="form-check-input" type="checkbox"
              name="SelectedInstructorIds" value="@instructor.ID"
              id="instructor_@instructor.ID" @(isChecked ? "checked" : "") />
              <label class="form-check-label" for="instructor_@instructor.ID">
                @instructor.FullName
                <small class="text-muted">(@instructor.Email)</small>
              </label>
            </div>
            }
          </div>

          @if (!Model.AllInstructors.Any()) {
          <p class="text-muted">
            No instructors available.
            <a asp-page="/Instructors/Create">Create one</a>.
          </p>
          }
        </div>
      </div>
    </div>
  </div>

  <div class="form-group mt-3">
    <button type="submit" class="btn btn-primary">Save Changes</button>
    <a
      asp-page="./Details"
      asp-route-id="@Model.Course.CourseID"
      class="btn btn-secondary"
      >Cancel</a
    >
  </div>
</form>

@section Scripts { @{await
Html.RenderPartialAsync("_ValidationScriptsPartial");} }
```

### Step 3: Add Styling for Instructor List

Add to `wwwroot/css/site.css`:

```css
/* Instructor Assignment Styles */
.instructor-list {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  background-color: var(--color-background);
}

.form-check {
  padding: var(--space-sm);
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast);
}

.form-check:hover {
  background-color: rgba(255, 107, 53, 0.05);
}

.form-check-input:checked {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}
```

---

## Part 5: Update Instructor Views

### Step 1: Update Instructor Details

In `Pages/Instructors/Details.cshtml.cs`, add:

```csharp
public List<Course> AssignedCourses { get; set; }

public async Task<IActionResult> OnGetAsync(int? id)
{
    // ... existing code ...

    Instructor = await _context.Instructors
        .Include(i => i.OfficeAssignment)
        .Include(i => i.CourseAssignments)
            .ThenInclude(ca => ca.Course)
                .ThenInclude(c => c.Department)
        .AsNoTracking()
        .FirstOrDefaultAsync(m => m.ID == id);

    if (Instructor == null)
    {
        return NotFound();
    }

    AssignedCourses = Instructor.CourseAssignments
        .Select(ca => ca.Course)
        .ToList();

    return Page();
}
```

### Step 2: Update Instructor Details View

In `Pages/Instructors/Details.cshtml`, add a section:

```html
<div class="card mt-4">
  <div class="card-header">
    <h4>Courses Teaching</h4>
  </div>
  <div class="card-body">
    @if (Model.AssignedCourses.Any()) {
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Course Number</th>
          <th>Title</th>
          <th>Department</th>
          <th>Credits</th>
        </tr>
      </thead>
      <tbody>
        @foreach (var course in Model.AssignedCourses) {
        <tr>
          <td>
            <a asp-page="/Courses/Details" asp-route-id="@course.CourseID">
              @course.CourseID
            </a>
          </td>
          <td>@course.Title</td>
          <td>@course.Department.Name</td>
          <td>@course.Credits</td>
        </tr>
        }
      </tbody>
    </table>
    } else {
    <p class="text-muted">
      This instructor is not assigned to any courses yet.
    </p>
    }
  </div>
</div>
```

---

## Part 6: Testing

### Test Scenarios

1. **Assign Instructor to Course**

   - Go to Courses → Select a course → Edit
   - Check one or more instructors
   - Save
   - Verify on Course Details page

2. **Remove Instructor from Course**

   - Go to Courses → Select a course with instructors → Edit
   - Uncheck an instructor
   - Save
   - Verify removal on Course Details page

3. **View Instructor's Courses**

   - Go to Instructors → Select an instructor → Details
   - Verify assigned courses are displayed

4. **Cascade Delete**
   - Assign instructor to a course
   - Delete the instructor
   - Verify course still exists
   - Verify assignment is removed

### Step-by-Step Testing

```bash
# Start the application
cd ContosoUniversity
dotnet run
```

1. Navigate to `https://localhost:7054/Courses`
2. Click "Edit" on any course
3. Select multiple instructors from the checkbox list
4. Click "Save Changes"
5. Click "Details" to verify instructors are shown
6. Navigate to an instructor's details page
7. Verify courses are listed

---

## Part 7: API Implementation (Optional - if completed Lab 2)

### Create DTO

Create `DTOs/CourseWithInstructorsDto.cs`:

```csharp
public class CourseWithInstructorsDto
{
    public int CourseID { get; set; }
    public string Title { get; set; }
    public int Credits { get; set; }
    public string DepartmentName { get; set; }
    public List<InstructorBasicDto> Instructors { get; set; }
}

public class InstructorBasicDto
{
    public int ID { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
}
```

### Add API Endpoint

In `Controllers/CoursesController.cs`:

```csharp
[HttpPost("{id}/instructors/{instructorId}")]
public async Task<IActionResult> AssignInstructor(int id, int instructorId)
{
    var course = await _context.Courses
        .Include(c => c.CourseAssignments)
        .FirstOrDefaultAsync(c => c.CourseID == id);

    if (course == null)
        return NotFound("Course not found");

    var instructor = await _context.Instructors.FindAsync(instructorId);
    if (instructor == null)
        return NotFound("Instructor not found");

    // Check if already assigned
    if (course.CourseAssignments.Any(ca => ca.InstructorID == instructorId))
        return BadRequest("Instructor already assigned to this course");

    course.CourseAssignments.Add(new CourseAssignment
    {
        CourseID = id,
        InstructorID = instructorId
    });

    await _context.SaveChangesAsync();
    return NoContent();
}

[HttpDelete("{id}/instructors/{instructorId}")]
public async Task<IActionResult> RemoveInstructor(int id, int instructorId)
{
    var assignment = await _context.Set<CourseAssignment>()
        .FirstOrDefaultAsync(ca => ca.CourseID == id && ca.InstructorID == instructorId);

    if (assignment == null)
        return NotFound("Assignment not found");

    _context.Remove(assignment);
    await _context.SaveChangesAsync();

    return NoContent();
}
```

---

## Key Takeaways

1. **Many-to-Many Relationships**: Understanding join tables and navigation properties
2. **UI for Relationships**: Checkboxes are effective for multi-select scenarios
3. **Data Integrity**: Proper cascade deletes prevent orphaned records
4. **User Experience**: Clear feedback when managing relationships

## Challenge Extensions

1. **Bulk Operations**: Add "Assign to multiple courses" on instructor page
2. **Search & Filter**: Add search when assigning instructors to large course lists
3. **Assignment History**: Track when assignments were made and by whom
4. **Load Teaching**: Show instructor's teaching load (total credits)
5. **Conflict Detection**: Prevent assigning instructors to courses at same time slot (requires Lab 7)

## Resources

- [EF Core Many-to-Many Relationships](https://learn.microsoft.com/ef/core/modeling/relationships/many-to-many)
- [ASP.NET Core Model Binding](https://learn.microsoft.com/aspnet/core/mvc/models/model-binding)

---

Continue to **Lab 7: Course Scheduling** to add dates and times to courses!

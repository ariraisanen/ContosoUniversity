# Data Model: .NET 9 Framework Upgrade

**Feature**: 001-dotnet9-upgrade  
**Date**: 2025-11-12  
**Impact**: None - Framework upgrade only

## Overview

This framework upgrade does NOT modify the data model. All existing entities, relationships, and database schema remain unchanged.

## Entity Model Status

### No Changes Required

The following entities remain identical in structure, validation, and relationships:

#### Student
```csharp
// Location: ContosoUniversity/Models/Student.cs
// Status: No changes
public class Student
{
    public int ID { get; set; }
    public string LastName { get; set; }
    public string FirstMidName { get; set; }
    public DateTime EnrollmentDate { get; set; }
    
    public ICollection<Enrollment> Enrollments { get; set; }
}
```

#### Course
```csharp
// Location: ContosoUniversity/Models/Course.cs
// Status: No changes
public class Course
{
    public int CourseID { get; set; }
    public string Title { get; set; }
    public int Credits { get; set; }
    public int DepartmentID { get; set; }
    
    public Department Department { get; set; }
    public ICollection<Enrollment> Enrollments { get; set; }
}
```

#### Instructor
```csharp
// Location: ContosoUniversity/Models/Instructor.cs
// Status: No changes
public class Instructor
{
    public int ID { get; set; }
    public string LastName { get; set; }
    public string FirstMidName { get; set; }
    public DateTime HireDate { get; set; }
    
    public OfficeAssignment OfficeAssignment { get; set; }
    public ICollection<Course> Courses { get; set; }
}
```

#### Department
```csharp
// Location: ContosoUniversity/Models/Department.cs
// Status: No changes
public class Department
{
    public int DepartmentID { get; set; }
    public string Name { get; set; }
    public decimal Budget { get; set; }
    public DateTime StartDate { get; set; }
    public int? InstructorID { get; set; }
    public byte[] RowVersion { get; set; }
    
    public Instructor Administrator { get; set; }
    public ICollection<Course> Courses { get; set; }
}
```

#### Enrollment
```csharp
// Location: ContosoUniversity/Models/Enrollment.cs
// Status: No changes
public class Enrollment
{
    public int EnrollmentID { get; set; }
    public int CourseID { get; set; }
    public int StudentID { get; set; }
    public Grade? Grade { get; set; }
    
    public Course Course { get; set; }
    public Student Student { get; set; }
}
```

#### OfficeAssignment
```csharp
// Location: ContosoUniversity/Models/OfficeAssignment.cs
// Status: No changes
public class OfficeAssignment
{
    public int InstructorID { get; set; }
    public string Location { get; set; }
    
    public Instructor Instructor { get; set; }
}
```

## Entity Relationships

All relationships remain unchanged:

```
Student 1--* Enrollment *--1 Course
Instructor 1--? OfficeAssignment
Instructor 1--* Course (via CourseAssignments)
Department 1--* Course
Department *--? Instructor (Administrator)
```

## Database Schema

### Migrations Status
- **20220226005057_InitialCreate.cs**: No changes required - compatible with EF Core 9
- **20220226012101_RowVersion.cs**: No changes required - compatible with EF Core 9
- **SchoolContextModelSnapshot.cs**: Will be automatically updated by EF Core tools to reflect EF Core 9 metadata (no schema changes)

### Schema Compatibility
- All table structures remain unchanged
- All column types remain unchanged
- All constraints and indexes remain unchanged
- RowVersion concurrency tokens remain compatible
- Seed data format remains unchanged

## Validation Rules

All existing validation rules remain enforced:

- **Student**: FirstMidName and LastName required
- **Course**: Title required, Credits must be valid
- **Department**: Name and Budget required, StartDate required
- **Instructor**: LastName and FirstMidName required, HireDate required
- **Enrollment**: Grade optional (nullable enum)

## State Transitions

No state machines or workflow changes. Entity lifecycle remains:
1. Create → Persist
2. Read → Display
3. Update → Validate → Persist
4. Delete → Remove relationships → Persist

## Framework Impact Analysis

### EF Core 9 Compatibility
- **No breaking changes** in entity configuration for this model
- **No breaking changes** in relationship configuration
- **No breaking changes** in validation attributes
- **Snapshot update**: EF Core will update ModelSnapshot to EF Core 9 metadata format (internal only)

### ASP.NET Core 9 Compatibility
- **No breaking changes** in model binding
- **No breaking changes** in validation framework
- **No breaking changes** in Razor Page model binding

## Testing Verification

### Data Integrity Tests
After upgrade, verify:
- [ ] All entities can be created via UI
- [ ] All entities can be read via UI
- [ ] All entities can be updated via UI
- [ ] All entities can be deleted via UI
- [ ] All relationships persist correctly
- [ ] All validation rules enforce correctly
- [ ] Concurrency token (RowVersion) works correctly

### Migration Tests
- [ ] `dotnet ef database update` applies all migrations successfully
- [ ] Seed data initializes correctly
- [ ] Existing database (if any) upgrades without data loss

## Conclusion

**No data model changes required for .NET 9 upgrade.** This document confirms that all entities, relationships, and database schema remain fully compatible with the framework upgrade.

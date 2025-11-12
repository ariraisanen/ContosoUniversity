# Data Model: DTOs and API Contracts

**Feature**: React SPA Migration with REST API Backend  
**Branch**: `002-react-spa-migration`  
**Date**: 2025-11-12

## Overview

This document defines the Data Transfer Objects (DTOs) used by the REST API to communicate between the backend and frontend. DTOs serve as contracts between the two layers and may differ from the internal entity models.

---

## Entity Models (Existing - No Changes)

### Student

```csharp
public class Student
{
    public int ID { get; set; }
    public string LastName { get; set; }
    public string FirstMidName { get; set; }
    public DateTime EnrollmentDate { get; set; }
    [Timestamp]
    public byte[] RowVersion { get; set; }

    public ICollection<Enrollment> Enrollments { get; set; }
}
```

### Course

```csharp
public class Course
{
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int CourseID { get; set; }
    public string Title { get; set; }
    public int Credits { get; set; }
    public int DepartmentID { get; set; }
    [Timestamp]
    public byte[] RowVersion { get; set; }

    public Department Department { get; set; }
    public ICollection<Enrollment> Enrollments { get; set; }
    public ICollection<CourseAssignment> CourseAssignments { get; set; }
}
```

### Department

```csharp
public class Department
{
    public int DepartmentID { get; set; }
    public string Name { get; set; }
    public decimal Budget { get; set; }
    public DateTime StartDate { get; set; }
    public int? InstructorID { get; set; }
    [Timestamp]
    public byte[] RowVersion { get; set; }

    public Instructor Administrator { get; set; }
    public ICollection<Course> Courses { get; set; }
}
```

### Instructor

```csharp
public class Instructor
{
    public int ID { get; set; }
    public string LastName { get; set; }
    public string FirstMidName { get; set; }
    public DateTime HireDate { get; set; }
    [Timestamp]
    public byte[] RowVersion { get; set; }

    public ICollection<CourseAssignment> CourseAssignments { get; set; }
    public OfficeAssignment OfficeAssignment { get; set; }
}
```

### Enrollment

```csharp
public class Enrollment
{
    public int EnrollmentID { get; set; }
    public int CourseID { get; set; }
    public int StudentID { get; set; }
    public Grade? Grade { get; set; }
    [Timestamp]
    public byte[] RowVersion { get; set; }

    public Course Course { get; set; }
    public Student Student { get; set; }
}

public enum Grade
{
    A, B, C, D, F
}
```

### OfficeAssignment

```csharp
public class OfficeAssignment
{
    [Key]
    public int InstructorID { get; set; }
    public string Location { get; set; }

    public Instructor Instructor { get; set; }
}
```

### CourseAssignment

```csharp
public class CourseAssignment
{
    public int InstructorID { get; set; }
    public int CourseID { get; set; }

    public Instructor Instructor { get; set; }
    public Course Course { get; set; }
}
```

---

## Data Transfer Objects (DTOs)

### StudentDto

**Purpose**: Represents a student in API responses and requests.

```csharp
public class StudentDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string FullName => $"{FirstName} {LastName}";
    public string EnrollmentDate { get; set; } // ISO 8601 format
    public int EnrollmentCount { get; set; }
    public string RowVersion { get; set; } // Base64 encoded
}
```

**TypeScript Interface**:

```typescript
export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  enrollmentDate: string; // ISO 8601
  enrollmentCount: number;
  rowVersion: string;
}
```

**Mapping Logic**:

- `Id` ← `Student.ID`
- `FirstName` ← `Student.FirstMidName`
- `LastName` ← `Student.LastName`
- `EnrollmentDate` ← `Student.EnrollmentDate.ToString("O")` (ISO 8601 format)
- `EnrollmentCount` ← `Student.Enrollments?.Count ?? 0`
- `RowVersion` ← `Convert.ToBase64String(Student.RowVersion)`

**Validation Rules**:

- `FirstName`: Required, MaxLength(50), MinLength(1)
- `LastName`: Required, MaxLength(50), MinLength(1)
- `EnrollmentDate`: Required, Must not be in the future, Must be valid date

---

### CourseDto

**Purpose**: Represents a course in API responses and requests.

```csharp
public class CourseDto
{
    public int CourseId { get; set; }
    public string Title { get; set; }
    public int Credits { get; set; }
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; }
    public int EnrollmentCount { get; set; }
    public string RowVersion { get; set; }
}
```

**TypeScript Interface**:

```typescript
export interface Course {
  courseId: number;
  title: string;
  credits: number;
  departmentId: number;
  departmentName: string;
  enrollmentCount: number;
  rowVersion: string;
}
```

**Mapping Logic**:

- `CourseId` ← `Course.CourseID`
- `Title` ← `Course.Title`
- `Credits` ← `Course.Credits`
- `DepartmentId` ← `Course.DepartmentID`
- `DepartmentName` ← `Course.Department?.Name ?? ""`
- `EnrollmentCount` ← `Course.Enrollments?.Count ?? 0`
- `RowVersion` ← `Convert.ToBase64String(Course.RowVersion)`

**Validation Rules**:

- `CourseId`: Required (for updates), Range(1000, 9999) for manual entry
- `Title`: Required, MaxLength(50), MinLength(1)
- `Credits`: Required, Range(0, 5)
- `DepartmentId`: Required, Must exist in database

---

### DepartmentDto

**Purpose**: Represents a department in API responses and requests.

```csharp
public class DepartmentDto
{
    public int DepartmentId { get; set; }
    public string Name { get; set; }
    public decimal Budget { get; set; }
    public string StartDate { get; set; } // ISO 8601 format
    public int? AdministratorId { get; set; }
    public string AdministratorName { get; set; }
    public int CourseCount { get; set; }
    public string RowVersion { get; set; }
}
```

**TypeScript Interface**:

```typescript
export interface Department {
  departmentId: number;
  name: string;
  budget: number;
  startDate: string; // ISO 8601
  administratorId: number | null;
  administratorName: string | null;
  courseCount: number;
  rowVersion: string;
}
```

**Mapping Logic**:

- `DepartmentId` ← `Department.DepartmentID`
- `Name` ← `Department.Name`
- `Budget` ← `Department.Budget`
- `StartDate` ← `Department.StartDate.ToString("O")`
- `AdministratorId` ← `Department.InstructorID`
- `AdministratorName` ← `Department.Administrator != null ? $"{Administrator.FirstMidName} {Administrator.LastName}" : null`
- `CourseCount` ← `Department.Courses?.Count ?? 0`
- `RowVersion` ← `Convert.ToBase64String(Department.RowVersion)`

**Validation Rules**:

- `Name`: Required, MaxLength(50), MinLength(1)
- `Budget`: Required, Range(0, decimal.MaxValue)
- `StartDate`: Required, Must be valid date
- `AdministratorId`: Optional, Must exist in Instructors table if provided

---

### InstructorDto

**Purpose**: Represents an instructor in API responses and requests.

```csharp
public class InstructorDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string FullName => $"{FirstName} {LastName}";
    public string HireDate { get; set; } // ISO 8601 format
    public string OfficeLocation { get; set; }
    public List<CourseAssignmentDto> CourseAssignments { get; set; }
    public string RowVersion { get; set; }
}

public class CourseAssignmentDto
{
    public int CourseId { get; set; }
    public string CourseTitle { get; set; }
}
```

**TypeScript Interface**:

```typescript
export interface Instructor {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  hireDate: string; // ISO 8601
  officeLocation: string | null;
  courseAssignments: CourseAssignment[];
  rowVersion: string;
}

export interface CourseAssignment {
  courseId: number;
  courseTitle: string;
}
```

**Mapping Logic**:

- `Id` ← `Instructor.ID`
- `FirstName` ← `Instructor.FirstMidName`
- `LastName` ← `Instructor.LastName`
- `HireDate` ← `Instructor.HireDate.ToString("O")`
- `OfficeLocation` ← `Instructor.OfficeAssignment?.Location`
- `CourseAssignments` ← `Instructor.CourseAssignments.Select(ca => new CourseAssignmentDto { CourseId = ca.CourseID, CourseTitle = ca.Course.Title })`
- `RowVersion` ← `Convert.ToBase64String(Instructor.RowVersion)`

**Validation Rules**:

- `FirstName`: Required, MaxLength(50), MinLength(1)
- `LastName`: Required, MaxLength(50), MinLength(1)
- `HireDate`: Required, Must not be in the future, Must be valid date
- `OfficeLocation`: Optional, MaxLength(50)

---

### EnrollmentDto

**Purpose**: Represents a student enrollment in a course.

```csharp
public class EnrollmentDto
{
    public int EnrollmentId { get; set; }
    public int CourseId { get; set; }
    public string CourseTitle { get; set; }
    public int StudentId { get; set; }
    public string StudentName { get; set; }
    public string Grade { get; set; } // "A", "B", "C", "D", "F", or null
    public string RowVersion { get; set; }
}
```

**TypeScript Interface**:

```typescript
export type GradeValue = "A" | "B" | "C" | "D" | "F";

export interface Enrollment {
  enrollmentId: number;
  courseId: number;
  courseTitle: string;
  studentId: number;
  studentName: string;
  grade: GradeValue | null;
  rowVersion: string;
}
```

**Mapping Logic**:

- `EnrollmentId` ← `Enrollment.EnrollmentID`
- `CourseId` ← `Enrollment.CourseID`
- `CourseTitle` ← `Enrollment.Course?.Title ?? ""`
- `StudentId` ← `Enrollment.StudentID`
- `StudentName` ← `Enrollment.Student != null ? $"{Student.FirstMidName} {Student.LastName}" : ""`
- `Grade` ← `Enrollment.Grade?.ToString()` (enum to string)
- `RowVersion` ← `Convert.ToBase64String(Enrollment.RowVersion)`

**Validation Rules**:

- `CourseId`: Required, Must exist in Courses table
- `StudentId`: Required, Must exist in Students table
- `Grade`: Optional, Must be one of: "A", "B", "C", "D", "F"
- Unique constraint: A student cannot enroll in the same course twice

---

### PaginatedResponseDto<T>

**Purpose**: Generic wrapper for paginated API responses.

```csharp
public class PaginatedResponseDto<T>
{
    public List<T> Data { get; set; }
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}
```

**TypeScript Interface**:

```typescript
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
```

**Calculation**:

- `TotalPages` = `Math.Ceiling(TotalCount / (double)PageSize)`

---

### ErrorResponseDto

**Purpose**: Standardized error response format.

```csharp
public class ErrorResponseDto
{
    public string Error { get; set; }
    public string Field { get; set; } // Optional, for validation errors
}
```

**TypeScript Interface**:

```typescript
export interface ErrorResponse {
  error: string;
  field?: string;
}
```

**Usage Examples**:

- Validation error: `{"error": "First name is required", "field": "firstName"}`
- Not found: `{"error": "Student not found with ID 123"}`
- Conflict: `{"error": "Record was modified by another user. Please refresh and try again."}`
- Server error: `{"error": "An unexpected error occurred. Please try again later."}`

---

### EnrollmentDateGroupDto

**Purpose**: Statistics data for enrollment date grouping.

```csharp
public class EnrollmentDateGroupDto
{
    public DateTime EnrollmentDate { get; set; }
    public int StudentCount { get; set; }
}
```

**TypeScript Interface**:

```typescript
export interface EnrollmentDateGroup {
  enrollmentDate: string; // ISO 8601
  studentCount: number;
}
```

---

## DTO Mapping Extensions

### Extension Methods Pattern

```csharp
public static class StudentMappings
{
    public static StudentDto ToDto(this Student student)
    {
        return new StudentDto
        {
            Id = student.ID,
            FirstName = student.FirstMidName,
            LastName = student.LastName,
            EnrollmentDate = student.EnrollmentDate.ToString("O"),
            EnrollmentCount = student.Enrollments?.Count ?? 0,
            RowVersion = Convert.ToBase64String(student.RowVersion)
        };
    }

    public static void UpdateFromDto(this Student student, StudentDto dto)
    {
        student.FirstMidName = dto.FirstName;
        student.LastName = dto.LastName;
        student.EnrollmentDate = DateTime.Parse(dto.EnrollmentDate);
        if (!string.IsNullOrEmpty(dto.RowVersion))
        {
            student.RowVersion = Convert.FromBase64String(dto.RowVersion);
        }
    }
}
```

---

## API Response Examples

### Successful GET (Single Item)

```json
{
  "id": 1,
  "firstName": "Carson",
  "lastName": "Alexander",
  "fullName": "Carson Alexander",
  "enrollmentDate": "2019-09-01T00:00:00Z",
  "enrollmentCount": 3,
  "rowVersion": "AAAAAAAAB9E="
}
```

### Successful GET (Paginated List)

```json
{
  "data": [
    {
      "id": 1,
      "firstName": "Carson",
      "lastName": "Alexander",
      "fullName": "Carson Alexander",
      "enrollmentDate": "2019-09-01T00:00:00Z",
      "enrollmentCount": 3,
      "rowVersion": "AAAAAAAAB9E="
    },
    {
      "id": 2,
      "firstName": "Meredith",
      "lastName": "Alonso",
      "fullName": "Meredith Alonso",
      "enrollmentDate": "2017-09-01T00:00:00Z",
      "enrollmentCount": 4,
      "rowVersion": "AAAAAAAAB9F="
    }
  ],
  "totalCount": 25,
  "pageNumber": 1,
  "pageSize": 10,
  "totalPages": 3
}
```

### Validation Error (400 Bad Request)

```json
{
  "error": "First name is required",
  "field": "firstName"
}
```

### Not Found (404)

```json
{
  "error": "Student not found with ID 999"
}
```

### Concurrency Conflict (409)

```json
{
  "error": "Record was modified by another user. Please refresh and try again."
}
```

### Server Error (500)

```json
{
  "error": "An unexpected error occurred. Please try again later."
}
```

---

## Summary

This data model defines:

- **5 Primary DTOs**: Student, Course, Department, Instructor, Enrollment
- **3 Supporting DTOs**: PaginatedResponse, ErrorResponse, EnrollmentDateGroup
- **2 Nested DTOs**: CourseAssignment
- **Validation Rules**: For all input DTOs
- **Mapping Strategy**: Extension methods for entity ↔ DTO conversion
- **TypeScript Interfaces**: Mirror DTOs for type-safe frontend development

All DTOs use camelCase property names (JSON standard) and include `rowVersion` for optimistic concurrency control.

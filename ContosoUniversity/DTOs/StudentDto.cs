// T025: Student DTO with validation attributes
#nullable enable
using System.ComponentModel.DataAnnotations;
using ContosoUniversity.Models;

namespace ContosoUniversity.DTOs;

/// <summary>
/// Data transfer object for Student entity
/// </summary>
public class StudentDto
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Last name is required")]
    [StringLength(50, ErrorMessage = "Last name cannot exceed 50 characters")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "First name is required")]
    [StringLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
    public string FirstMidName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Enrollment date is required")]
    [DataType(DataType.Date)]
    public DateTime EnrollmentDate { get; set; }

    public string FullName => $"{LastName}, {FirstMidName}";

    public int EnrollmentCount { get; set; }
}

/// <summary>
/// DTO for creating a new student
/// </summary>
public class CreateStudentDto
{
    [Required(ErrorMessage = "Last name is required")]
    [StringLength(50, ErrorMessage = "Last name cannot exceed 50 characters")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "First name is required")]
    [StringLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
    public string FirstMidName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Enrollment date is required")]
    [DataType(DataType.Date)]
    public DateTime EnrollmentDate { get; set; }
}

/// <summary>
/// DTO for updating an existing student
/// </summary>
public class UpdateStudentDto
{
    [Required(ErrorMessage = "Last name is required")]
    [StringLength(50, ErrorMessage = "Last name cannot exceed 50 characters")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "First name is required")]
    [StringLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
    public string FirstMidName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Enrollment date is required")]
    [DataType(DataType.Date)]
    public DateTime EnrollmentDate { get; set; }

    /// <summary>
    /// Row version for optimistic concurrency control
    /// </summary>
    public byte[]? RowVersion { get; set; }
}

/// <summary>
/// Mapping extension methods for Student entity and DTOs
/// </summary>
public static class StudentMappings
{
    /// <summary>
    /// Convert Student entity to StudentDto
    /// </summary>
    public static StudentDto ToDto(this Student student)
    {
        return new StudentDto
        {
            Id = student.ID,
            LastName = student.LastName,
            FirstMidName = student.FirstMidName,
            EnrollmentDate = student.EnrollmentDate,
            EnrollmentCount = student.Enrollments?.Count ?? 0
        };
    }

    /// <summary>
    /// Update Student entity from UpdateStudentDto
    /// </summary>
    public static void UpdateFromDto(this Student student, UpdateStudentDto dto)
    {
        student.LastName = dto.LastName;
        student.FirstMidName = dto.FirstMidName;
        student.EnrollmentDate = dto.EnrollmentDate;
    }

    /// <summary>
    /// Create Student entity from CreateStudentDto
    /// </summary>
    public static Student ToEntity(this CreateStudentDto dto)
    {
        return new Student
        {
            LastName = dto.LastName,
            FirstMidName = dto.FirstMidName,
            EnrollmentDate = dto.EnrollmentDate
        };
    }
}

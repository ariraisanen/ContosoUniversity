// T052-T055: Course DTOs and mappings
#nullable enable
using System.ComponentModel.DataAnnotations;
using ContosoUniversity.Models;

namespace ContosoUniversity.DTOs;

/// <summary>
/// Data transfer object for Course entity
/// </summary>
public class CourseDto
{
    public int CourseId { get; set; }

    [Required(ErrorMessage = "Course number is required")]
    public int CourseNumber { get; set; }

    [Required(ErrorMessage = "Title is required")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 50 characters")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Credits is required")]
    [Range(0, 5, ErrorMessage = "Credits must be between 0 and 5")]
    public int Credits { get; set; }

    [Required(ErrorMessage = "Department is required")]
    public int DepartmentId { get; set; }

    public string DepartmentName { get; set; } = string.Empty;

    public int EnrollmentCount { get; set; }
}

/// <summary>
/// DTO for creating a new course
/// </summary>
public class CreateCourseDto
{
    [Required(ErrorMessage = "Course number is required")]
    [Range(1, 9999, ErrorMessage = "Course number must be between 1 and 9999")]
    public int CourseNumber { get; set; }

    [Required(ErrorMessage = "Title is required")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 50 characters")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Credits is required")]
    [Range(0, 5, ErrorMessage = "Credits must be between 0 and 5")]
    public int Credits { get; set; }

    [Required(ErrorMessage = "Department is required")]
    public int DepartmentId { get; set; }
}

/// <summary>
/// DTO for updating an existing course
/// </summary>
public class UpdateCourseDto
{
    [Required(ErrorMessage = "Title is required")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 50 characters")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Credits is required")]
    [Range(0, 5, ErrorMessage = "Credits must be between 0 and 5")]
    public int Credits { get; set; }

    [Required(ErrorMessage = "Department is required")]
    public int DepartmentId { get; set; }

    public byte[]? RowVersion { get; set; }
}

/// <summary>
/// Mapping extension methods for Course entity and DTOs
/// </summary>
public static class CourseMappings
{
    public static CourseDto ToDto(this Course course)
    {
        return new CourseDto
        {
            CourseId = course.CourseID,
            CourseNumber = course.CourseID,
            Title = course.Title,
            Credits = course.Credits,
            DepartmentId = course.DepartmentID,
            DepartmentName = course.Department?.Name ?? "Unknown",
            EnrollmentCount = course.Enrollments?.Count ?? 0
        };
    }

    public static void UpdateFromDto(this Course course, UpdateCourseDto dto)
    {
        course.Title = dto.Title;
        course.Credits = dto.Credits;
        course.DepartmentID = dto.DepartmentId;
    }

    public static Course ToEntity(this CreateCourseDto dto)
    {
        return new Course
        {
            CourseID = dto.CourseNumber,
            Title = dto.Title,
            Credits = dto.Credits,
            DepartmentID = dto.DepartmentId
        };
    }
}

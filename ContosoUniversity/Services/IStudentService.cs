// T029: Student service interface
#nullable enable
using ContosoUniversity.DTOs;

namespace ContosoUniversity.Services;

/// <summary>
/// Service interface for Student operations
/// </summary>
public interface IStudentService
{
    /// <summary>
    /// Get paginated list of students with optional search
    /// </summary>
    /// <param name="pageNumber">Page number (1-based)</param>
    /// <param name="pageSize">Number of items per page</param>
    /// <param name="searchString">Optional search string for filtering by name</param>
    /// <returns>Paginated response with student DTOs</returns>
    Task<PaginatedResponseDto<StudentDto>> GetStudentsAsync(
        int pageNumber = 1,
        int pageSize = 10,
        string? searchString = null);

    /// <summary>
    /// Get a single student by ID
    /// </summary>
    /// <param name="id">Student ID</param>
    /// <returns>Student DTO or null if not found</returns>
    Task<StudentDto?> GetStudentByIdAsync(int id);

    /// <summary>
    /// Create a new student
    /// </summary>
    /// <param name="createDto">Student creation data</param>
    /// <returns>Created student DTO</returns>
    Task<StudentDto> CreateStudentAsync(CreateStudentDto createDto);

    /// <summary>
    /// Update an existing student
    /// </summary>
    /// <param name="id">Student ID</param>
    /// <param name="updateDto">Student update data with row version</param>
    /// <returns>Updated student DTO</returns>
    Task<StudentDto> UpdateStudentAsync(int id, UpdateStudentDto updateDto);

    /// <summary>
    /// Delete a student
    /// </summary>
    /// <param name="id">Student ID</param>
    /// <returns>True if deleted, false if not found</returns>
    Task<bool> DeleteStudentAsync(int id);

    /// <summary>
    /// Check if a student can be deleted (has no enrollments)
    /// </summary>
    /// <param name="id">Student ID</param>
    /// <returns>True if student can be deleted</returns>
    Task<bool> CanDeleteStudentAsync(int id);
}

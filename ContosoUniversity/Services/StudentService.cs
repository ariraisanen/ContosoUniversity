// T030: Student service implementation with EF Core
#nullable enable
using ContosoUniversity.Data;
using ContosoUniversity.DTOs;
using ContosoUniversity.Models;
using Microsoft.EntityFrameworkCore;

namespace ContosoUniversity.Services;

/// <summary>
/// Service implementation for Student operations
/// </summary>
public class StudentService : IStudentService
{
    private readonly SchoolContext _context;
    private readonly ILogger<StudentService> _logger;

    public StudentService(SchoolContext context, ILogger<StudentService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<PaginatedResponseDto<StudentDto>> GetStudentsAsync(
        int pageNumber = 1,
        int pageSize = 10,
        string? searchString = null)
    {
        var query = _context.Students
            .Include(s => s.Enrollments)
            .AsQueryable();

        // Apply search filter if provided
        if (!string.IsNullOrWhiteSpace(searchString))
        {
            query = query.Where(s =>
                s.LastName.Contains(searchString) ||
                s.FirstMidName.Contains(searchString));
        }

        // Get total count before pagination
        var totalCount = await query.CountAsync();

        // Calculate pagination metadata
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        var hasPrevious = pageNumber > 1;
        var hasNext = pageNumber < totalPages;

        // Apply pagination and ordering
        var students = await query
            .OrderBy(s => s.LastName)
            .ThenBy(s => s.FirstMidName)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var studentDtos = students.Select(s => s.ToDto()).ToList();

        return new PaginatedResponseDto<StudentDto>
        {
            Data = studentDtos,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = totalPages
        };
    }

    public async Task<StudentDto?> GetStudentByIdAsync(int id)
    {
        var student = await _context.Students
            .Include(s => s.Enrollments)
            .FirstOrDefaultAsync(s => s.ID == id);

        return student?.ToDto();
    }

    public async Task<StudentDto> CreateStudentAsync(CreateStudentDto createDto)
    {
        var student = createDto.ToEntity();

        _context.Students.Add(student);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Created student {StudentId}: {LastName}, {FirstName}",
            student.ID, student.LastName, student.FirstMidName);

        // Reload with enrollments for consistent DTO
        var createdStudent = await _context.Students
            .Include(s => s.Enrollments)
            .FirstAsync(s => s.ID == student.ID);

        return createdStudent.ToDto();
    }

    public async Task<StudentDto> UpdateStudentAsync(int id, UpdateStudentDto updateDto)
    {
        var student = await _context.Students
            .Include(s => s.Enrollments)
            .FirstOrDefaultAsync(s => s.ID == id);

        if (student == null)
        {
            throw new KeyNotFoundException($"Student with ID {id} not found");
        }

        // Update properties
        student.UpdateFromDto(updateDto);

        try
        {
            await _context.SaveChangesAsync();

            _logger.LogInformation("Updated student {StudentId}: {LastName}, {FirstName}",
                student.ID, student.LastName, student.FirstMidName);

            return student.ToDto();
        }
        catch (DbUpdateConcurrencyException ex)
        {
            // Check if the student still exists
            var exists = await _context.Students.AnyAsync(s => s.ID == id);
            if (!exists)
            {
                throw new KeyNotFoundException($"Student with ID {id} was deleted by another user");
            }

            _logger.LogWarning(ex, "Concurrency conflict updating student {StudentId}", id);
            throw; // Re-throw to be handled by error handling middleware
        }
    }

    public async Task<bool> DeleteStudentAsync(int id)
    {
        var student = await _context.Students
            .Include(s => s.Enrollments)
            .FirstOrDefaultAsync(s => s.ID == id);

        if (student == null)
        {
            return false;
        }

        // Check if student has enrollments
        if (student.Enrollments?.Any() == true)
        {
            throw new InvalidOperationException(
                $"Cannot delete student {student.FullName} because they have {student.Enrollments.Count} enrollment(s). " +
                "Remove enrollments first.");
        }

        _context.Students.Remove(student);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Deleted student {StudentId}: {LastName}, {FirstName}",
            id, student.LastName, student.FirstMidName);

        return true;
    }

    public async Task<bool> CanDeleteStudentAsync(int id)
    {
        var student = await _context.Students
            .Include(s => s.Enrollments)
            .FirstOrDefaultAsync(s => s.ID == id);

        if (student == null)
        {
            return false;
        }

        return student.Enrollments?.Any() != true;
    }
}

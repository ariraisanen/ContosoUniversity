// T032: Students API Controller with CRUD operations
#nullable enable
using ContosoUniversity.DTOs;
using ContosoUniversity.Services;
using Microsoft.AspNetCore.Mvc;

namespace ContosoUniversity.Controllers;

/// <summary>
/// API controller for managing students
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class StudentsController : ControllerBase
{
    private readonly IStudentService _studentService;
    private readonly ILogger<StudentsController> _logger;

    public StudentsController(
        IStudentService studentService,
        ILogger<StudentsController> logger)
    {
        _studentService = studentService;
        _logger = logger;
    }

    /// <summary>
    /// Get paginated list of students with optional search
    /// </summary>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 10, max: 100)</param>
    /// <param name="searchString">Optional search string for filtering by name</param>
    /// <returns>Paginated list of students</returns>
    /// <response code="200">Returns the paginated list of students</response>
    /// <response code="400">If the pagination parameters are invalid</response>
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedResponseDto<StudentDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PaginatedResponseDto<StudentDto>>> GetStudents(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchString = null)
    {
        // Validate pagination parameters
        if (pageNumber < 1)
        {
            return BadRequest("Page number must be greater than 0");
        }

        if (pageSize < 1 || pageSize > 100)
        {
            return BadRequest("Page size must be between 1 and 100");
        }

        var result = await _studentService.GetStudentsAsync(pageNumber, pageSize, searchString);
        return Ok(result);
    }

    /// <summary>
    /// Get a specific student by ID
    /// </summary>
    /// <param name="id">The student ID</param>
    /// <returns>The student details</returns>
    /// <response code="200">Returns the student</response>
    /// <response code="404">If the student is not found</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(StudentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<StudentDto>> GetStudent(int id)
    {
        var student = await _studentService.GetStudentByIdAsync(id);

        if (student == null)
        {
            _logger.LogWarning("Student {StudentId} not found", id);
            return NotFound(new { message = $"Student with ID {id} not found" });
        }

        return Ok(student);
    }

    /// <summary>
    /// Create a new student
    /// </summary>
    /// <param name="createDto">Student data</param>
    /// <returns>The created student</returns>
    /// <response code="201">Returns the newly created student</response>
    /// <response code="400">If the student data is invalid</response>
    [HttpPost]
    [ProducesResponseType(typeof(StudentDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<StudentDto>> CreateStudent([FromBody] CreateStudentDto createDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var student = await _studentService.CreateStudentAsync(createDto);

        return CreatedAtAction(
            nameof(GetStudent),
            new { id = student.Id },
            student);
    }

    /// <summary>
    /// Update an existing student
    /// </summary>
    /// <param name="id">The student ID</param>
    /// <param name="updateDto">Updated student data with row version</param>
    /// <returns>The updated student</returns>
    /// <response code="200">Returns the updated student</response>
    /// <response code="400">If the student data is invalid</response>
    /// <response code="404">If the student is not found</response>
    /// <response code="409">If there is a concurrency conflict</response>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(StudentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<StudentDto>> UpdateStudent(
        int id,
        [FromBody] UpdateStudentDto updateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var student = await _studentService.UpdateStudentAsync(id, updateDto);
            return Ok(student);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Student {StudentId} not found for update", id);
            return NotFound(new { message = ex.Message });
        }
        // DbUpdateConcurrencyException is handled by ErrorHandlingMiddleware
    }

    /// <summary>
    /// Delete a student
    /// </summary>
    /// <param name="id">The student ID</param>
    /// <returns>No content on success</returns>
    /// <response code="204">If the student was successfully deleted</response>
    /// <response code="404">If the student is not found</response>
    /// <response code="400">If the student has enrollments and cannot be deleted</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteStudent(int id)
    {
        try
        {
            var deleted = await _studentService.DeleteStudentAsync(id);

            if (!deleted)
            {
                _logger.LogWarning("Student {StudentId} not found for deletion", id);
                return NotFound(new { message = $"Student with ID {id} not found" });
            }

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Cannot delete student {StudentId}", id);
            return BadRequest(new { message = ex.Message });
        }
    }
}

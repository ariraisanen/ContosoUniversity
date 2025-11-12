namespace ContosoUniversity.DTOs;

/// <summary>
/// Represents an error response
/// </summary>
public class ErrorResponseDto
{
    /// <summary>
    /// The error message
    /// </summary>
    public string Error { get; set; } = string.Empty;

    /// <summary>
    /// The field name associated with the error (for validation errors)
    /// </summary>
    public string? Field { get; set; }
}

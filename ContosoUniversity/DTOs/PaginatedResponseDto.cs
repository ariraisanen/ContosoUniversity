namespace ContosoUniversity.DTOs;

/// <summary>
/// Represents a paginated response with metadata
/// </summary>
/// <typeparam name="T">The type of data items</typeparam>
public class PaginatedResponseDto<T>
{
    /// <summary>
    /// The list of data items for the current page
    /// </summary>
    public List<T> Data { get; set; } = new();

    /// <summary>
    /// Total number of items across all pages
    /// </summary>
    public int TotalCount { get; set; }

    /// <summary>
    /// Current page number (1-based)
    /// </summary>
    public int PageNumber { get; set; }

    /// <summary>
    /// Number of items per page
    /// </summary>
    public int PageSize { get; set; }

    /// <summary>
    /// Total number of pages
    /// </summary>
    public int TotalPages { get; set; }

    /// <summary>
    /// Whether there is a previous page
    /// </summary>
    public bool HasPrevious => PageNumber > 1;

    /// <summary>
    /// Whether there is a next page
    /// </summary>
    public bool HasNext => PageNumber < TotalPages;
}

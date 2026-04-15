namespace SimpleApi.Application.Common.Models;

/// <summary>
/// Tham số phân trang + sắp xếp (query string / body).
/// </summary>
public sealed class PagedRequest
{
    public const int DefaultPage = 1;

    public const int DefaultPageSize = 20;

    public const int MaxPageSize = 100;

    /// <summary>Trang bắt đầu từ 1.</summary>
    public int Page { get; init; } = DefaultPage;

    public int PageSize { get; init; } = DefaultPageSize;

    /// <summary>Tên thuộc tính CLR (ví dụ CreatedAt, Id). Không phân biệt hoa thường khi khớp whitelist.</summary>
    public string? SortBy { get; init; }

    public bool IsDesc { get; init; }
}

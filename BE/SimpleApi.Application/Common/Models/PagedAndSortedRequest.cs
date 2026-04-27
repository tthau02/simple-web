namespace SimpleApi.Application.Common.Models;

/// <summary>
/// Phân trang + sắp xếp dùng chung — DTO tìm kiếm/ danh sách kế thừa, không cần lặp thuộc tính.
/// </summary>
public abstract class PagedAndSortedRequest : IPagedRequest
{
    public const int DefaultPage = 1;
    public const int DefaultPageSize = 20;
    public const int MaxPageSize = 100;

    public int Page { get; init; } = DefaultPage;
    public int PageSize { get; init; } = DefaultPageSize;
    public string? SortBy { get; init; }
    public bool IsDesc { get; init; }
}

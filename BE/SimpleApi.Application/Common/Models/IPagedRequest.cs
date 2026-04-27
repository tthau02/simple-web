namespace SimpleApi.Application.Common.Models;

/// <summary>Hợp đồng request phân trang — dùng làm generic constraint (class sealed không dùng được làm constraint).</summary>
public interface IPagedRequest
{
    int Page { get; }

    int PageSize { get; }

    string? SortBy { get; }

    bool IsDesc { get; }
}

namespace SimpleApi.Application.Common.Paging;

/// <summary>Phân trang tập trung — service chỉ cần <c>query.ApplyPaging(window)</c>.</summary>
public static class QueryablePagingExtensions
{
    public static IQueryable<T> ApplyPaging<T>(this IQueryable<T> query, in PagingWindow window) =>
        query
            .Skip(window.Skip)
            .Take(window.Take);
}

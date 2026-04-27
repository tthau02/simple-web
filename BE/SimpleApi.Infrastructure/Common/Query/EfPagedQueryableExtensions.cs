using Microsoft.EntityFrameworkCore;
using SimpleApi.Application.Common.Models;
using SimpleApi.Application.Common.Paging;
using SimpleApi.Domain.Entities;

namespace SimpleApi.Infrastructure.Common.Query;

/// <summary>
/// Phân trang + sort EF cho bất kỳ <see cref="IQueryable{T}"/> (một chỗ dùng cho repository &amp; app service).
/// </summary>
public static class EfPagedQueryableExtensions
{
    public static async Task<PagedResult<T>> ToPagedResultAsync<T>(
        this IQueryable<T> source,
        IPagedRequest request,
        IReadOnlyCollection<string>? allowedSortProperties,
        string defaultSortPropertyName,
        CancellationToken cancellationToken = default)
        where T : BaseEntity
    {
        var window = request.ToPagingWindow();
        var sortField = PagedSortResolver.ResolveSortPropertyName<T>(
            request,
            allowedSortProperties,
            defaultSortPropertyName);
        var totalCount = await source.CountAsync(cancellationToken);
        var items = await source
            .OrderByEfProperty(sortField, request.IsDesc)
            .ApplyPaging(window)
            .ToListAsync(cancellationToken);

        return new PagedResult<T>
        {
            Items = items,
            Page = window.Page,
            PageSize = window.PageSize,
            TotalCount = totalCount,
            SortedBy = sortField,
            IsDesc = request.IsDesc,
        };
    }
}

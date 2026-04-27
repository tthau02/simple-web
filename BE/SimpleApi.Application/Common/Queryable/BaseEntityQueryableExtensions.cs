using SimpleApi.Application.Interfaces.Repositories;
using SimpleApi.Domain.Entities;

namespace SimpleApi.Application.Common.Queryable;

/// <summary>
/// Lọc entity chưa xóa mềm — dùng chung mọi module (User, Product…).
/// </summary>
public static class BaseEntityQueryableExtensions
{
    public static IQueryable<T> WhereNotDeleted<T>(this IQueryable<T> source)
        where T : BaseEntity =>
        source.Where(e => !e.IsDeleted);
}

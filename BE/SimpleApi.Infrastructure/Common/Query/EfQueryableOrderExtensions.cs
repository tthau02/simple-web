using Microsoft.EntityFrameworkCore;
using SimpleApi.Domain.Entities;

namespace SimpleApi.Infrastructure.Common.Query;

/// <summary>
/// Sắp xếp theo tên thuộc tính (EF.Property) + ThenBy(Id) ổn định — dùng chung cho EF.
/// </summary>
public static class EfQueryableOrderExtensions
{
    public static IQueryable<T> OrderByEfProperty<T>(
        this IQueryable<T> source,
        string propertyName,
        bool descending)
        where T : BaseEntity
    {
        if (descending)
        {
            return source
                .OrderByDescending(e => EF.Property<object>(e, propertyName))
                .ThenBy(e => e.Id);
        }

        return source
            .OrderBy(e => EF.Property<object>(e, propertyName))
            .ThenBy(e => e.Id);
    }
}

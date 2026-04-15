using System.Reflection;
using Microsoft.EntityFrameworkCore;
using SimpleApi.Application.Common.Models;
using SimpleApi.Application.Common.Paging;
using SimpleApi.Application.Interfaces.Repositories;
using SimpleApi.Domain.Entities;
using SimpleApi.Infrastructure.Data;

namespace SimpleApi.Infrastructure.Repositories;

public class Repository<T> : IRepository<T>
    where T : BaseEntity
{
    private readonly DbSet<T> _set;

    public Repository(SimpleDbContext context)
    {
        _set = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _set.FindAsync(new object[] { id }, cancellationToken);
    }

    public async Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _set.ToListAsync(cancellationToken);
    }

    public async Task<PagedResult<T>> GetPagedAsync(
        PagedRequest request,
        IReadOnlyCollection<string>? allowedSortProperties = null,
        CancellationToken cancellationToken = default)
    {
        var page = Math.Max(PagedRequest.DefaultPage, request.Page);
        var pageSize = request.PageSize <= 0
            ? PagedRequest.DefaultPageSize
            : Math.Clamp(request.PageSize, 1, PagedRequest.MaxPageSize);

        var query = _set.AsQueryable();
        var totalCount = await query.CountAsync(cancellationToken);

        var sortProperty = ResolveSortPropertyName(allowedSortProperties, request);
        var descending = request.IsDesc;

        var ordered = ApplyDynamicOrdering(query, sortProperty, descending);
        var skip = (page - 1) * pageSize;
        var items = await ordered.Skip(skip).Take(pageSize).ToListAsync(cancellationToken);

        return new PagedResult<T>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            SortedBy = sortProperty,
            IsDesc = descending,
        };
    }

    public IQueryable<T> Query() => _set.AsQueryable();

    public void Add(T entity) => _set.Add(entity);

    public void Update(T entity) => _set.Update(entity);

    public void Remove(T entity) => _set.Remove(entity);

    /// <summary>
    /// Sort bằng EF.Property (dịch sang ORDER BY); ThenBy(Id) để thứ tự ổn định khi trùng giá trị.
    /// </summary>
    private static IQueryable<T> ApplyDynamicOrdering(IQueryable<T> query, string sortPropertyName, bool descending)
    {
        if (descending)
        {
            return query
                .OrderByDescending(e => EF.Property<object>(e, sortPropertyName))
                .ThenBy(e => e.Id);
        }

        return query
            .OrderBy(e => EF.Property<object>(e, sortPropertyName))
            .ThenBy(e => e.Id);
    }

    /// <summary>
    /// Chỉ chấp nhận tên thuộc tính nằm trong whitelist và tồn tại trên <typeparamref name="T"/>.
    /// </summary>
    private static string ResolveSortPropertyName(
        IReadOnlyCollection<string>? allowedSortProperties,
        PagedRequest request)
    {
        var effectiveWhitelist = BuildEffectiveWhitelist(allowedSortProperties);

        var requested = request.SortBy?.Trim();
        if (string.IsNullOrEmpty(requested))
        {
            return ResolveClrPropertyName(typeof(T), PagingDefaults.DefaultSortProperty);
        }

        foreach (var candidate in effectiveWhitelist)
        {
            if (!candidate.Equals(requested, StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }

            var resolved = typeof(T).GetProperty(
                candidate,
                BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase);

            if (resolved != null)
            {
                return resolved.Name;
            }
        }

        return ResolveClrPropertyName(typeof(T), PagingDefaults.DefaultSortProperty);
    }

    private static IReadOnlyCollection<string> BuildEffectiveWhitelist(
        IReadOnlyCollection<string>? allowedSortProperties)
    {
        if (allowedSortProperties is { Count: > 0 })
        {
            return allowedSortProperties;
        }

        return PagingDefaults.BaseEntitySortFields
            .Where(name => typeof(T).GetProperty(
                name,
                BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase) != null)
            .ToArray();
    }

    private static string ResolveClrPropertyName(Type entityType, string propertyName)
    {
        var prop = entityType.GetProperty(
            propertyName,
            BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase);

        return prop?.Name ?? nameof(BaseEntity.Id);
    }
}

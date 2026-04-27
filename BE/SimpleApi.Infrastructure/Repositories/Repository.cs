using Microsoft.EntityFrameworkCore;
using SimpleApi.Application.Common.Models;
using SimpleApi.Application.Common.Paging;
using SimpleApi.Application.Interfaces.Repositories;
using SimpleApi.Domain.Entities;
using SimpleApi.Infrastructure.Common.Query;
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

    public async Task<T?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        return await _set.FindAsync(new object[] { id }, cancellationToken);
    }

    public async Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _set.ToListAsync(cancellationToken);
    }

    public async Task<PagedResult<T>> GetPagedAsync(
        IPagedRequest request,
        IReadOnlyCollection<string>? allowedSortProperties = null,
        CancellationToken cancellationToken = default)
    {
        return await _set.AsQueryable().ToPagedResultAsync(
            request,
            allowedSortProperties,
            PagingDefaults.DefaultSortProperty,
            cancellationToken);
    }

    public IQueryable<T> Query() => _set.AsQueryable();

    public void Add(T entity) => _set.Add(entity);

    public void Update(T entity) => _set.Update(entity);

    public void Remove(T entity) => _set.Remove(entity);
}

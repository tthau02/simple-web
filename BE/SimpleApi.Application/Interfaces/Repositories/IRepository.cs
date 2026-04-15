using SimpleApi.Application.Common.Models;
using SimpleApi.Domain.Entities;

namespace SimpleApi.Application.Interfaces.Repositories;

public interface IRepository<T>
    where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<PagedResult<T>> GetPagedAsync(
        PagedRequest request,
        IReadOnlyCollection<string>? allowedSortProperties = null,
        CancellationToken cancellationToken = default);

    IQueryable<T> Query();

    void Add(T entity);

    void Update(T entity);

    void Remove(T entity);
}

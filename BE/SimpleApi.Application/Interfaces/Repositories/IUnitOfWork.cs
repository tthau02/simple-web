using SimpleApi.Domain.Entities;

namespace SimpleApi.Application.Interfaces.Repositories;

public interface IUnitOfWork
{
    IRepository<T> Repository<T>() where T : BaseEntity;

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

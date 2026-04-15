using SimpleApi.Application.Interfaces.Repositories;
using SimpleApi.Domain.Entities;
using SimpleApi.Infrastructure.Data;
using SimpleApi.Infrastructure.Repositories;
using System;

public class UnitOfWork : IUnitOfWork, IDisposable
{
    private readonly SimpleDbContext _db;
    private readonly Dictionary<Type, object> _repositories = new();

    public UnitOfWork(SimpleDbContext db)
    {
        _db = db;
    }

    public IRepository<T> Repository<T>() where T : BaseEntity
    {
        var type = typeof(T);

        if (!_repositories.ContainsKey(type))
        {
            _repositories[type] = new Repository<T>(_db);
        }

        return (IRepository<T>)_repositories[type];
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _db.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        _db.Dispose();
    }
}
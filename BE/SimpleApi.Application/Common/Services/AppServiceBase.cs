using SimpleApi.Application.Interfaces.Repositories;
using SimpleApi.Domain.Entities;

namespace SimpleApi.Application.Common.Services;

/// <summary>
/// Ứng dụng service có <see cref="IUnitOfWork"/> — tất cả module CRUD nên kế thừa, tránh lặp <c>Uow.Repository&lt;T&gt;()</c>.
/// </summary>
public abstract class AppServiceBase : ApplicationService
{
    protected IUnitOfWork Uow { get; }

    protected AppServiceBase(IUnitOfWork uow)
    {
        Uow = uow;
    }

    protected IRepository<T> Repo<T>()
        where T : BaseEntity =>
        Uow.Repository<T>();

    protected IQueryable<T> Q<T>()
        where T : BaseEntity =>
        Repo<T>().Query();
}

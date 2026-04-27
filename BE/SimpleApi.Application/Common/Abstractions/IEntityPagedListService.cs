using SimpleApi.Application.Common.Models;
using SimpleApi.Application.Common.Paging;
using SimpleApi.Domain.Entities;

namespace SimpleApi.Application.Common.Abstractions;

/// <summary>
/// Hợp đồng danh sách phân trang chuẩn — module Product, Order… chỉ cần kế thừa với DTO/request tương ứng.
/// </summary>
public interface IEntityPagedListService<TListDto, in TListRequest>
    where TListRequest : class, IPagedRequest
{
    Task<PagedResult<TListDto>> GetPagedAsync(TListRequest request, CancellationToken cancellationToken = default);
}

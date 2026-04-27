namespace SimpleApi.Application.Common.Paging;

/// <summary>Giá trị chuẩn hóa từ <see cref="Models.PagedAndSortedRequest"/> (page, skip, take).</summary>
public readonly record struct PagingWindow(int Page, int PageSize, int Skip)
{
    public int Take => PageSize;
}

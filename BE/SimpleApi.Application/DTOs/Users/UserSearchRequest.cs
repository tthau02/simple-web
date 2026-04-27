using SimpleApi.Application.Common.Models;

namespace SimpleApi.Application.DTOs.Users;

/// <summary>
/// Tìm kiếm + phân trang: username, fullname, trạng thái tài khoản, theo role (Id hoặc tên).
/// </summary>
public sealed class UserSearchRequest : PagedAndSortedRequest
{
    public string? UserName { get; init; }
    public string? FullName { get; init; }
    public bool? Status { get; init; }
    public long? RoleId { get; init; }
    public string? RoleName { get; init; }
}

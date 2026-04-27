namespace SimpleApi.Application.DTOs.Users;

/// <summary>
/// Form quản trị: tạo hoặc sửa user. Create dùng RuleSet <c>Create</c>, cập nhật dùng <c>Update</c> (validation khác nhau).
/// </summary>
public sealed class UserCreateOrEditRequest
{
    public string? UserName { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Avatar { get; set; }
    public bool? Status { get; set; }

    /// <summary>
    /// Tạo: rỗng hoặc null = gán role mặc định (customer). Sửa: null = không đổi; có giá trị = thay toàn bộ.
    /// </summary>
    public IReadOnlyList<long>? RoleIds { get; set; }
}

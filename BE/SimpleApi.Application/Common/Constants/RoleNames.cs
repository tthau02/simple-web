namespace SimpleApi.Application.Common.Constants;

public static class RoleNames
{
    public const string Admin = "admin";
    public const string Staff = "staff";
    public const string Customer = "customer";

    /// <summary>Id tương ứng khi đã seed (identity): 1, 2, 3. Luôn ưu tiên tra theo tên bảng Roles.</summary>
    public const long AdminId = 1;
    public const long StaffId = 2;
    public const long CustomerId = 3;
}

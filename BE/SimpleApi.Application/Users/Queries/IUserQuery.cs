namespace SimpleApi.Application.Users.Queries;

/// <summary>
/// Truy vấn đọc User/Role bằng LINQ (join), không dùng Include — mẫu tương tự custom repository / query interface trong ABP.
/// </summary>
public interface IUserQuery
{
    Task<IReadOnlyList<string>> GetRoleNamesForUserAsync(long userId, CancellationToken cancellationToken = default);

    /// <summary>Nhóm tên role theo UserId — dùng sau khi phân trang User để tránh N+1.</summary>
    Task<IReadOnlyDictionary<long, IReadOnlyList<string>>> GetRoleNamesGroupedByUserIdsAsync(
        IReadOnlyCollection<long> userIds,
        CancellationToken cancellationToken = default);
}

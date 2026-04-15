using SimpleApi.Domain.Entities;

namespace SimpleApi.Application.Common.Paging;

/// <summary>
/// Giá trị mặc định an toàn cho phân trang (không chứa logic EF).
/// </summary>
public static class PagingDefaults
{
    /// <summary>Các cột được phép sort khi không truyền whitelist tùy chỉnh (chỉ thuộc tính của <see cref="BaseEntity"/>).</summary>
    public static readonly IReadOnlySet<string> BaseEntitySortFields = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
    {
        nameof(BaseEntity.Id),
        nameof(BaseEntity.CreatedAt),
        nameof(BaseEntity.CreatedBy),
        nameof(BaseEntity.UpdatedAt),
        nameof(BaseEntity.UpdatedBy),
        nameof(BaseEntity.IsDeleted),
    };

    public const string DefaultSortProperty = nameof(BaseEntity.CreatedAt);
}

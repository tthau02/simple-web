using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SimpleApi.Domain.Entities;
using SimpleApi.Infrastructure.Data;

namespace SimpleApi.Infrastructure.Data;

public static class RoleDataSeeder
{
    public static async Task SeedAsync(SimpleDbContext db, ILogger? logger, CancellationToken cancellationToken = default)
    {
        if (await db.Roles.AnyAsync(cancellationToken))
        {
            return;
        }

        var createdAt = DateTimeOffset.UtcNow;
        // Bảng trống: identity thường sẽ là 1, 2, 3 cho ba dòng này (trùng mô tả: admin, staff, customer)
        db.Roles.AddRange(
            new Role
            {
                Name = "admin",
                DisplayName = "Quản trị hệ thống",
                IsStatic = true,
                CreatedAt = createdAt,
                IsDeleted = false,
            },
            new Role
            {
                Name = "staff",
                DisplayName = "Nhân viên",
                IsStatic = false,
                CreatedAt = createdAt,
                IsDeleted = false,
            },
            new Role
            {
                Name = "customer",
                DisplayName = "Khách hàng",
                IsStatic = false,
                CreatedAt = createdAt,
                IsDeleted = false,
            });
        await db.SaveChangesAsync(cancellationToken);
        logger?.LogInformation("Seeded 3 static roles: admin, staff, customer");
    }
}

using Microsoft.EntityFrameworkCore;
using SimpleApi.Domain.Entities;
using SimpleApi.Infrastructure.Data.Configurations;

namespace SimpleApi.Infrastructure.Data;

public class SimpleDbContext : DbContext
{
    public SimpleDbContext(DbContextOptions<SimpleDbContext> options)
        : base(options)
    {
    }
    public virtual DbSet<User> Users { get; set; } = default!;
    public virtual DbSet<Role> Roles { get; set; } = default!;
    public virtual DbSet<UserRole> UserRoles { get; set; } = default!;
    public virtual DbSet<Permission> Permissions { get; set; } = default!;
    public virtual DbSet<PermissionGrant> PermissionGrants { get; set; } = default!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Mọi entity : BaseEntity: Id, CreatedAt, audit — không cần file IEntityTypeConfiguration/entity
        modelBuilder.ApplyBaseEntityConventions();
        // Bổ sung fluent cho từng nhóm bảng (có thể tách nhiều extension khi dự án lớn)
        modelBuilder.ConfigureUserRoleModel();
        base.OnModelCreating(modelBuilder);
    }
}
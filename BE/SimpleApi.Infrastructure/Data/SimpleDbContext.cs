using Microsoft.EntityFrameworkCore;

namespace SimpleApi.Infrastructure.Data;

public class SimpleDbContext : DbContext
{
    public SimpleDbContext(DbContextOptions<SimpleDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(SimpleDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}

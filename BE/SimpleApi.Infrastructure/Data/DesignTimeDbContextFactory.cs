using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace SimpleApi.Infrastructure.Data;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<SimpleDbContext>
{
    public SimpleDbContext CreateDbContext(string[] args)
    {
        var basePath = ResolveAppSettingsBasePath();

        var configuration = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: true)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "Connection string 'DefaultConnection' not found. Set it in SimpleApi/appsettings.json.");

        var optionsBuilder = new DbContextOptionsBuilder<SimpleDbContext>();
        optionsBuilder.UseSqlServer(connectionString);

        return new SimpleDbContext(optionsBuilder.Options);
    }

    private static string ResolveAppSettingsBasePath()
    {
        var candidates = new[]
        {
            Directory.GetCurrentDirectory(),
            Path.Combine(Directory.GetCurrentDirectory(), "SimpleApi"),
            Path.Combine(Directory.GetCurrentDirectory(), "..", "SimpleApi"),
            Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "SimpleApi"),
        };

        foreach (var candidate in candidates)
        {
            var full = Path.GetFullPath(candidate);
            var path = Path.Combine(full, "appsettings.json");
            if (File.Exists(path))
            {
                return full;
            }
        }

        throw new InvalidOperationException(
            "Could not find SimpleApi/appsettings.json. Run from the solution folder, e.g. " +
            "dotnet ef migrations add ... --project SimpleApi.Infrastructure --startup-project SimpleApi");
    }
}

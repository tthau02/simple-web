using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SimpleApi.Application.Interfaces.Repositories;
using SimpleApi.Infrastructure.Data;
using SimpleApi.Infrastructure.Data.Interceptors;
using SimpleApi.Infrastructure.Repositories;

namespace SimpleApi.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' is not configured.");

        services.AddSingleton<AuditableEntitySaveChangesInterceptor>();

        services.AddDbContext<SimpleDbContext>((sp, options) =>
        {
            options.UseSqlServer(connectionString)
                .AddInterceptors(sp.GetRequiredService<AuditableEntitySaveChangesInterceptor>());
        });

        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SimpleApi.Application.Interfaces.Repositories;
using SimpleApi.Application.Interfaces.Services;
using SimpleApi.Application.Options;
using SimpleApi.Application.Users.Queries;
using SimpleApi.Domain.Entities;
using SimpleApi.Infrastructure.Data;
using SimpleApi.Infrastructure.Data.Interceptors;
using SimpleApi.Infrastructure.Repositories;
using SimpleApi.Infrastructure.Services;
using SimpleApi.Infrastructure.Users.Queries;

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

        services.AddOptions<JwtOptions>()
            .Bind(configuration.GetSection(JwtOptions.SectionName));

        services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IUserService, UserService>();

        services.AddScoped<IUserQuery, EfUserQuery>();

        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}

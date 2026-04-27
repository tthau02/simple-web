using SimpleApi.Domain.Entities;

namespace SimpleApi.Application.Interfaces.Services;

public interface IJwtTokenService
{
    (string token, DateTimeOffset expiresAtUtc) CreateToken(User user, IReadOnlyCollection<string> roleNames);
}

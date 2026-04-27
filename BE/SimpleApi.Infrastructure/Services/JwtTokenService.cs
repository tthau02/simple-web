using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SimpleApi.Application.Interfaces.Services;
using SimpleApi.Application.Options;
using SimpleApi.Domain.Entities;

namespace SimpleApi.Infrastructure.Services;

public sealed class JwtTokenService : IJwtTokenService
{
    private readonly JwtOptions _options;
    private readonly SymmetricSecurityKey _signingKey;

    public JwtTokenService(IOptions<JwtOptions> options)
    {
        _options = options.Value;
        if (string.IsNullOrWhiteSpace(_options.Key) || _options.Key.Length < 32)
        {
            throw new InvalidOperationException("Jwt:Key phải cấu hình ít nhất 32 ký tự (HS256).");
        }
        _signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Key));
    }

    public (string token, DateTimeOffset expiresAtUtc) CreateToken(User user, IReadOnlyCollection<string> roleNames)
    {
        var expires = DateTimeOffset.UtcNow.AddMinutes(_options.AccessTokenMinutes);
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.UserName),
            new(ClaimTypes.Email, user.Email),
        };
        foreach (var r in roleNames)
        {
            claims.Add(new Claim(ClaimTypes.Role, r));
        }

        var creds = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256);
        var jwt = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: expires.UtcDateTime,
            signingCredentials: creds);

        var token = new JwtSecurityTokenHandler().WriteToken(jwt);
        return (token, expires);
    }
}

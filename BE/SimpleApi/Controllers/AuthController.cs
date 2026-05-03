using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimpleApi.Application.Common.Models;
using SimpleApi.Application.DTOs.Users;
using SimpleApi.Application.Interfaces.Services;

namespace SimpleApi.Controllers;

public sealed class AuthController : BaseController
{
    private readonly IUserService _users;

    public AuthController(IUserService users)
    {
        _users = users;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<UserDto>>> Register(
        [FromBody] RegisterRequest request,
        CancellationToken cancellationToken)
    {
        var user = await _users.RegisterAsync(request, cancellationToken);
        return OkResponse(user, "Đăng ký thành công.");
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Login(
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _users.LoginAsync(request, cancellationToken);
        return OkResponse(result);
    }
}

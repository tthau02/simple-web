using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SimpleApi.Application.Common.Models;

namespace SimpleApi.Controllers;

/// <summary>
/// Phản hồi chuẩn và context user từ HTTP — không chứa nghiệp vụ, không gọi DB hay service.
/// </summary>
[ApiController]
[Route("v1/api/[controller]")]
public abstract class BaseController : ControllerBase
{
    protected ActionResult<ApiResponse<T>> OkResponse<T>(T data, string? message = null) =>
        Ok(ApiResponse.Ok(data, message));

    protected ActionResult<ApiResponse<T>> CreatedResponse<T>(string actionName, object? routeValues, T data) =>
        CreatedAtAction(actionName, routeValues, ApiResponse.Ok(data));

    protected ActionResult<ApiResponse<object?>> NoContentResponse(string? message = null) =>
        Ok(ApiResponse.Ok<object?>(null, message ?? "Success"));

    protected ActionResult<ApiResponse<object?>> FailResponse(string message, int statusCode = 400) =>
        StatusCode(statusCode, ApiResponse.Fail(message, statusCode));

    /// <summary>404 với body <see cref="ApiResponse{T}"/> — dùng khi không tìm thấy tài nguyên.</summary>
    protected NotFoundObjectResult NotFoundResponse(string message) =>
        NotFound(ApiResponse.Fail(message, 404));

    protected long? CurrentUserId
    {
        get
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return long.TryParse(userId, out var id) ? id : null;
        }
    }

    protected string? CurrentUserName => User.Identity?.Name;

    protected bool IsAuthenticated => User.Identity?.IsAuthenticated ?? false;
}

using System.Net;
using System.Text.Json;
using FluentValidation;
using SimpleApi.Application.Common.Models;

namespace SimpleApi.Middleware;

public class ExceptionHandlingMiddleware
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            var errors = ex.Errors.Select(e => e.ErrorMessage).ToList();
            await WriteResponseAsync(
                context,
                HttpStatusCode.BadRequest,
                ApiResponse.Fail("Validation failed", (int)HttpStatusCode.BadRequest, errors));
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Resource not found");
            await WriteResponseAsync(
                context,
                HttpStatusCode.NotFound,
                ApiResponse.Fail(ex.Message, (int)HttpStatusCode.NotFound));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            await WriteResponseAsync(
                context,
                HttpStatusCode.InternalServerError,
                ApiResponse.Fail("An unexpected error occurred.", (int)HttpStatusCode.InternalServerError));
        }
    }

    private static async Task WriteResponseAsync<T>(HttpContext context, HttpStatusCode status, ApiResponse<T> body)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)status;
        await context.Response.WriteAsync(JsonSerializer.Serialize(body, JsonOptions));
    }
}

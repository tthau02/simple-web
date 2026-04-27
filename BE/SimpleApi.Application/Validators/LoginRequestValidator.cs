using FluentValidation;
using SimpleApi.Application.DTOs.Users;

namespace SimpleApi.Application.Validators;

public sealed class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Login).NotEmpty();
        RuleFor(x => x.Password).NotEmpty();
    }
}

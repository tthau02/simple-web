using FluentValidation;
using SimpleApi.Application.DTOs.Users;

namespace SimpleApi.Application.Validators;

public sealed class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.UserName).NotEmpty().MaximumLength(256);
        RuleFor(x => x.FullName).NotEmpty().MaximumLength(256);
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(256);
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6).MaximumLength(256);
        RuleFor(x => x.PhoneNumber).MaximumLength(32);
    }
}

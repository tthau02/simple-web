using FluentValidation;
using SimpleApi.Application.Common.Models;
using SimpleApi.Application.DTOs.Users;

namespace SimpleApi.Application.Common.Validation;

public sealed class PagedAndSortedRequestValidator<T> : AbstractValidator<T>
    where T : PagedAndSortedRequest
{
    public PagedAndSortedRequestValidator()
    {
        RuleFor(x => x.Page).GreaterThanOrEqualTo(PagedAndSortedRequest.DefaultPage);
        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, PagedAndSortedRequest.MaxPageSize);
    }
}

public sealed class PagedRequestValidator : AbstractValidator<PagedRequest>
{
    public PagedRequestValidator()
    {
        Include(new PagedAndSortedRequestValidator<PagedRequest>());
    }
}

public sealed class UserSearchRequestValidator : AbstractValidator<UserSearchRequest>
{
    public UserSearchRequestValidator()
    {
        Include(new PagedAndSortedRequestValidator<UserSearchRequest>());
        RuleFor(x => x.UserName).MaximumLength(256);
        RuleFor(x => x.FullName).MaximumLength(256);
        RuleFor(x => x.RoleName).MaximumLength(128);
    }
}

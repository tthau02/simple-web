using FluentValidation;
using SimpleApi.Application.Common.Models;

namespace SimpleApi.Application.Common.Validation;

public sealed class PagedRequestValidator : AbstractValidator<PagedRequest>
{
    public PagedRequestValidator()
    {
        RuleFor(x => x.Page).GreaterThanOrEqualTo(PagedRequest.DefaultPage);

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, PagedRequest.MaxPageSize);
    }
}

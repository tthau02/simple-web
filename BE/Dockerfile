# Build from repo root: docker compose build api
# Or: docker build -f BE/Dockerfile BE
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY SimpleApi.sln ./
COPY SimpleApi/SimpleApi.csproj SimpleApi/
COPY SimpleApi.Application/SimpleApi.Application.csproj SimpleApi.Application/
COPY SimpleApi.Domain/SimpleApi.Domain.csproj SimpleApi.Domain/
COPY SimpleApi.Infrastructure/SimpleApi.Infrastructure.csproj SimpleApi.Infrastructure/

RUN dotnet restore SimpleApi/SimpleApi.csproj

COPY SimpleApi/ SimpleApi/
COPY SimpleApi.Application/ SimpleApi.Application/
COPY SimpleApi.Domain/ SimpleApi.Domain/
COPY SimpleApi.Infrastructure/ SimpleApi.Infrastructure/

RUN dotnet publish SimpleApi/SimpleApi.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SimpleApi.dll"]

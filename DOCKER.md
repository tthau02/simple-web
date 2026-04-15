# Docker

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Compose v2)

## Quick start

1. From the `SimpleApi` folder (where `docker-compose.yml` lives):

   ```bash
   copy .env.docker.example .env
   ```

   On Linux/macOS: `cp .env.docker.example .env`

2. Edit `.env` if you change ports or deploy behind another hostname.

3. Build and run:

   ```bash
   docker compose up --build
   ```

4. Open the web app at `http://localhost:3000` and the API at `http://localhost:8080`.

## Build images only

```bash
docker compose build
```

## Production notes

- Set `NEXT_PUBLIC_API_URL` to the **public** API URL before building the `web` image (browser must reach it).
- Set `PUBLIC_WEB_ORIGIN` to the **public** web origin for CORS (e.g. `https://app.example.com`).
- Change `MSSQL_SA_PASSWORD` to a strong secret; never commit `.env`.

## SQL Server tools path

If the `sql` service health check fails (wrong `sqlcmd` path in the image), install tools or adjust the `healthcheck` in `docker-compose.yml` to match your image version.

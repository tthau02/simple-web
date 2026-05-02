const base = process.env.NEXT_PUBLIC_API_URL ?? "";

export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue>;

export type ApiEnvelope<T> = {
  success: boolean;
  message?: string | null;
  data?: T | null;
  errors?: string[] | null;
  statusCode: number;
};

export type ApiRequestInit = Omit<RequestInit, "body"> & {
  body?: unknown;
  query?: QueryParams;
  token?: string;
};

export class ApiError extends Error {
  status: number;
  details?: string[];

  constructor(message: string, status: number, details?: string[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function appendQuery(path: string, query?: QueryParams): string {
  if (!query) return path;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined || value === "") continue;
    params.set(key, String(value));
  }

  const qs = params.toString();
  if (!qs) return path;
  return `${path}${path.includes("?") ? "&" : "?"}${qs}`;
}

export function apiUrl(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${base.replace(/\/$/, "")}${path}`;
}

export async function apiFetch<T>(
  path: string,
  init?: ApiRequestInit,
): Promise<T> {
  const { body, query, token, headers, ...rest } = init ?? {};
  const finalPath = appendQuery(path, query);

  const requestHeaders = new Headers(headers);
  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }
  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(apiUrl(finalPath), {
    ...rest,
    headers: requestHeaders,
    body:
      body === undefined
        ? undefined
        : body instanceof FormData
          ? body
          : JSON.stringify(body),
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson
    ? ((await res.json()) as ApiEnvelope<T> | T)
    : undefined;

  if (!res.ok) {
    if (payload && typeof payload === "object" && "statusCode" in payload) {
      const envelope = payload as ApiEnvelope<T>;
      throw new ApiError(
        envelope.message ?? `API ${res.status}: ${res.statusText}`,
        envelope.statusCode ?? res.status,
        envelope.errors ?? undefined,
      );
    }
    throw new ApiError(`API ${res.status}: ${res.statusText}`, res.status);
  }

  if (payload && typeof payload === "object" && "statusCode" in payload) {
    const envelope = payload as ApiEnvelope<T>;
    if (!envelope.success) {
      throw new ApiError(
        envelope.message ?? "Yeu cau that bai.",
        envelope.statusCode,
        envelope.errors ?? undefined,
      );
    }
    return envelope.data as T;
  }

  return payload as T;
}

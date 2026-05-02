import { apiFetch } from "@/lib/api-client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from "@/types/auth";

const AUTH_BASE = "/api/auth";

export const authService = {
  login(payload: LoginRequest): Promise<LoginResponse> {
    return apiFetch<LoginResponse>(`${AUTH_BASE}/login`, {
      method: "POST",
      body: payload,
    });
  },

  register(payload: RegisterRequest): Promise<User> {
    return apiFetch<User>(`${AUTH_BASE}/register`, {
      method: "POST",
      body: payload,
    });
  },
};

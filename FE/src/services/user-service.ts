import { apiFetch } from "@/lib/api-client";
import type { User } from "@/types/auth";
import type {
  UserCreateOrEditRequest,
  UserSearchParams,
} from "@/types/users";

const USERS_BASE = "/v1/api/Users";

export const userService = {
  search(params: UserSearchParams, token?: string): Promise<User[]> {
    return apiFetch<User[]>(`${USERS_BASE}/search`, {
      method: "GET",
      query: params,
      token,
    });
  },

  getById(id: number, token?: string): Promise<User> {
    return apiFetch<User>(`${USERS_BASE}/${id}`, {
      method: "GET",
      token,
    });
  },

  create(payload: UserCreateOrEditRequest, token?: string): Promise<User> {
    return apiFetch<User>(USERS_BASE, {
      method: "POST",
      body: payload,
      token,
    });
  },

  update(
    id: number,
    payload: UserCreateOrEditRequest,
    token?: string,
  ): Promise<User> {
    return apiFetch<User>(`${USERS_BASE}/${id}`, {
      method: "PUT",
      body: payload,
      token,
    });
  },

  remove(id: number, token?: string): Promise<null> {
    return apiFetch<null>(`${USERS_BASE}/${id}`, {
      method: "DELETE",
      token,
    });
  },
};

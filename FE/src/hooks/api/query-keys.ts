import type { UserSearchParams } from "@/types/users";

export const queryKeys = {
  users: {
    all: ["users"] as const,
    list: (params: UserSearchParams) => ["users", "list", params] as const,
    detail: (id: number) => ["users", "detail", id] as const,
  },
};

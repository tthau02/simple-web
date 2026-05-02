import type { PagedResult } from "@/types/api";
import type { User } from "@/types/auth";

export type UserSearchParams = {
  page?: number;
  pageSize?: number;
  sortedBy?: string;
  isDesc?: boolean;
  userName?: string;
  fullName?: string;
  status?: boolean;
  roleId?: number;
  roleName?: string;
};

export type UserCreateOrEditRequest = {
  userName?: string;
  fullName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  avatar?: string;
  status?: boolean;
  roleIds?: number[] | null;
};

export type UserPagedResult = PagedResult<User>;

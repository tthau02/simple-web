"use client";

import { useState } from "react";
import {
  ActionPanel,
  CommonForm,
  CommonFormItems,
  getCommonFormRuleErrors,
  type CommonFormItem,
} from "@/components/shared/common";
import { ApiError } from "@/lib/api-client";
import { showToast } from "@/lib/toast";
import { useCreateUserMutation, useUpdateUserMutation } from "@/hooks/api";
import type { User } from "@/types/auth";
import type { UserCreateOrEditRequest } from "@/types/users";

export type UserFormDraft = {
  userName: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  avatar: string;
  status: boolean;
  roleIds: string;
};

const EMPTY_USER_DRAFT: UserFormDraft = {
  userName: "",
  fullName: "",
  email: "",
  password: "",
  phoneNumber: "",
  avatar: "",
  status: true,
  roleIds: "",
};

function toDraft(user: User | null): UserFormDraft {
  if (!user) return { ...EMPTY_USER_DRAFT };
  return {
    userName: user.userName,
    fullName: user.fullName,
    email: user.email,
    password: "",
    phoneNumber: user.phoneNumber ?? "",
    avatar: user.avatar ?? "",
    status: user.status,
    roleIds: "",
  };
}

function parseRoleIds(raw: string): number[] | null {
  const items = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s))
    .filter((n) => Number.isInteger(n) && n > 0);
  if (!items.length) return null;
  return Array.from(new Set(items));
}

export const USER_FORM_ITEMS: CommonFormItem<UserFormDraft>[] = [
  {
    type: "row",
    columnsClassName: "md:grid-cols-2",
    children: [
      {
        type: "input",
        name: "userName",
        label: "Tên đăng nhập",
        rules: { required: true, minLength: 3, maxLength: 100 },
      },
      {
        type: "input",
        name: "fullName",
        label: "Họ và tên",
        rules: { required: true, minLength: 2, maxLength: 150 },
      },
    ],
  },
  {
    type: "row",
    columnsClassName: "md:grid-cols-2",
    children: [
      {
        type: "email",
        name: "email",
        label: "Email",
        rules: { required: true, emailFormat: true, maxLength: 200 },
      },
      {
        type: "password",
        name: "password",
        label: "Mật khẩu",
        placeholder: "Bỏ trống khi sửa nếu không đổi",
        rules: { minLength: 6, maxLength: 200 },
      },
    ],
  },
  {
    type: "row",
    columnsClassName: "md:grid-cols-2",
    children: [
      {
        type: "input",
        name: "phoneNumber",
        label: "Số điện thoại",
        rules: { maxLength: 30 },
      },
      {
        type: "input",
        name: "roleIds",
        label: "Vai trò",
        placeholder: "Chọn vai trò",
      },
    ],
  },
  {
    type: "row",
    columnsClassName: "md:grid-cols-2",
    children: [
      {
        type: "image",
        name: "avatar",
        label: "Avatar URL",
        rules: { maxLength: 500 },
      },
      {
        type: "switch",
        name: "status",
        label: "Hoạt động",
      },
    ],
  },
];

type CreateOrEditUserPanelProps = {
  open: boolean;
  mode: "add" | "edit";
  editingUser: User | null;
  token?: string;
  onOpenChange: (open: boolean) => void;
};

export function CreateOrEditUserPanel({
  open,
  mode,
  editingUser,
  token,
  onOpenChange,
}: CreateOrEditUserPanelProps) {
  const [values, setValues] = useState<UserFormDraft>(() => toDraft(editingUser));
  const [errors, setErrors] = useState<Partial<Record<keyof UserFormDraft, string>>>({});
  const createMutation = useCreateUserMutation(token);
  const updateMutation = useUpdateUserMutation(token);

  const buildPayload = (): UserCreateOrEditRequest => {
    const roleIds = parseRoleIds(values.roleIds);
    return {
      userName: values.userName.trim(),
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      password: values.password.trim() || undefined,
      phoneNumber: values.phoneNumber.trim() || undefined,
      avatar: values.avatar.trim() || undefined,
      status: values.status,
      roleIds,
    };
  };

  const handleConfirm = (): boolean => {
    const nextErrors = getCommonFormRuleErrors(USER_FORM_ITEMS, values);
    if (mode === "add" && !values.password.trim()) {
      nextErrors.password = "Mật khẩu là bắt buộc khi tạo mới.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return false;

    if (!token) {
      setErrors((prev) => ({
        ...prev,
        userName: prev.userName ?? "Thiếu access token. Vui lòng đăng nhập lại.",
      }));
      return false;
    }

    const payload = buildPayload();
    if (mode === "add") {
      createMutation.mutate(payload, {
        onSuccess: (user) => {
          showToast({
            type: "success",
            title: "Đã tạo người dùng",
            message: user.userName,
            color: "success",
          });
          onOpenChange(false);
        },
        onError: (err) => {
          const message =
            err instanceof ApiError ? err.message : "Không thể tạo người dùng.";
          showToast({
            type: "error",
            title: "Tạo thất bại",
            message,
            color: "destructive",
          });
        },
      });
      return false;
    }
    if (!editingUser) return false;
    updateMutation.mutate(
      { id: editingUser.id, payload },
      {
        onSuccess: (user) => {
          showToast({
            type: "success",
            title: "Đã cập nhật",
            message: user.userName,
            color: "success",
          });
          onOpenChange(false);
        },
        onError: (err) => {
          const message =
            err instanceof ApiError ? err.message : "Không thể cập nhật.";
          showToast({
            type: "error",
            title: "Cập nhật thất bại",
            message,
            color: "destructive",
          });
        },
      },
    );
    return false;
  };

  return (
    <ActionPanel
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setErrors({});
        }
        onOpenChange(nextOpen);
      }}
      title={mode === "add" ? "Thêm người dùng" : "Sửa người dùng"}
      onConfirm={handleConfirm}
    >
      <CommonForm
        id="admin-user-form"
        className="min-w-0"
        onSubmit={(e) => {
          e.preventDefault();
          handleConfirm();
        }}
      >
        <CommonFormItems
          idPrefix="admin-user"
          items={USER_FORM_ITEMS}
          values={values}
          errors={errors}
          onValuesChange={(patch) => {
            setValues((prev) => ({ ...prev, ...patch }));
            setErrors((prev) => {
              const next = { ...prev };
              for (const key of Object.keys(patch) as (keyof UserFormDraft)[]) {
                delete next[key];
              }
              return next;
            });
          }}
        />
      </CommonForm>
    </ActionPanel>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import {
  CommonHeader,
  CommonTable,
  CommonTableFilter,
  type CommonHeaderProps,
  type CommonTableAction,
  type CommonTableColumn,
  type SortDirection,
  type TableFilterField,
  type TableFilterValues,
} from "@/components/shared/common";
import { CreateOrEditUserPanel } from "./create-or-edit-user-panel";
import { ApiError } from "@/lib/api-client";
import { showToast } from "@/lib/toast";
import {
  useDeleteUserMutation,
  useUsersQuery,
} from "@/hooks/api";
import type { User } from "@/types/auth";
import type { UserSearchParams } from "@/types/users";

type UserRow = User & { detailPath: string };

type UserActionPanelState = {
  open: boolean;
  mode: "add" | "edit";
  editingRow: UserRow | null;
};

const TOKEN_KEYS = ["accessToken", "token", "authToken"] as const;

function getStoredToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  for (const key of TOKEN_KEYS) {
    const value = localStorage.getItem(key)?.trim();
    if (value) return value;
  }
  return undefined;
}

export default function AdminUsersPage() {
  const defaultFilterValues: TableFilterValues = {
    q: "",
    status: "",
  };
  const [filterValues, setFilterValues] = useState<TableFilterValues>(
    () => defaultFilterValues,
  );
  const [sortKey, setSortKey] = useState<string | null>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(
    "desc",
  );
  const [token] = useState<string | undefined>(() => getStoredToken());
  const [panelState, setPanelState] = useState<UserActionPanelState>({
    open: false,
    mode: "add",
    editingRow: null,
  });

  const queryParams = useMemo<UserSearchParams>(() => {
    const q = String(filterValues.q ?? "").trim();
    const statusFilter = String(filterValues.status ?? "");
    return {
      page: 1,
      pageSize: 200,
      sortedBy: sortKey ?? "createdAt",
      isDesc: sortDirection !== "asc",
      userName: q || undefined,
      fullName: q || undefined,
      status:
        statusFilter === "active"
          ? true
          : statusFilter === "inactive"
            ? false
            : undefined,
    };
  }, [filterValues, sortKey, sortDirection]);

  const usersQuery = useUsersQuery(queryParams, token, {
    enabled: Boolean(token),
  });

  const deleteMutation = useDeleteUserMutation(token);

  const rows = useMemo<UserRow[]>(() => {
    const list = usersQuery.data?.items ?? [];
    return list.map((u) => ({ ...u, detailPath: `/admin/users/${u.id}` }));
  }, [usersQuery.data]);

  const openActionPanel = (mode: "add" | "edit", row: UserRow | null) => {
    setPanelState({ open: true, mode, editingRow: row });
  };

  const columns: CommonTableColumn<UserRow>[] = [
    { id: "userName", label: "Tên đăng nhập", type: "text", sortable: true },
    {
      id: "fullName",
      label: "Họ và tên",
      type: "link",
      linkHrefKey: "detailPath",
      sortable: true,
    },
    { id: "email", label: "Email", type: "email", sortable: true },
    { id: "phoneNumber", label: "SĐT", type: "text" },
    { id: "status", label: "Trạng thái", type: "boolean", sortable: true },
    { id: "createdAt", label: "Tạo lúc", type: "datetime", sortable: true },
  ];

  const filterFields: TableFilterField[] = [
    {
      type: "input",
      id: "q",
      label: "Tìm kiếm",
      placeholder: "UserName hoặc Họ tên",
    },
    {
      type: "select",
      id: "status",
      label: "Trạng thái",
      placeholder: "Tất cả",
      clearable: true,
      options: [
        { value: "active", label: "Đang hoạt động" },
        { value: "inactive", label: "Đã khóa" },
      ],
    },
  ];

  const pageHeader: CommonHeaderProps = {
    title: "Người dùng",
    subtitle: "danh sách",
    actions: [
      {
        id: "add",
        label: "Thêm mới",
        icon: <Plus className="size-3.5" aria-hidden />,
        variant: "default",
        onClick: () => openActionPanel("add", null),
      },
    ],
  };

  const actions: CommonTableAction<UserRow>[] = [
    {
      id: "edit",
      label: "Sửa",
      icon: <Pencil className="size-3.5" aria-hidden />,
      variant: "outline",
      onClick: (row) => openActionPanel("edit", row),
    },
    {
      id: "delete",
      label: "Xóa",
      icon: <Trash2 className="size-3.5" aria-hidden />,
      variant: "destructive",
      onClick: (row) => {
        if (!token) return;
        if (!window.confirm(`Xóa người dùng "${row.userName}"?`)) return;
        deleteMutation.mutate(row.id, {
          onSuccess: () => {
            showToast({
              type: "success",
              title: "Đã xóa người dùng",
              message: row.userName,
              color: "success",
            });
          },
          onError: (err) => {
            const message =
              err instanceof ApiError ? err.message : "Không thể xóa.";
            showToast({
              type: "error",
              title: "Xóa thất bại",
              message,
              color: "destructive",
            });
          },
        });
      },
    },
  ];

  const loadError =
    usersQuery.error instanceof ApiError
      ? usersQuery.error.message
      : usersQuery.error
        ? "Không thể tải danh sách người dùng."
        : null;

  return (
    <div className="flex min-h-0 flex-col gap-4">
      <CommonHeader {...pageHeader} />

      {!token ? (
        <div className="rounded-[12px] border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Chưa có access token trong localStorage (`accessToken` / `token` /
          `authToken`). Hãy đăng nhập trước khi CRUD người dùng.
        </div>
      ) : null}
      {loadError ? (
        <div className="rounded-[12px] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {loadError}
        </div>
      ) : null}
      <div className="flex min-h-0 flex-col gap-4 lg:flex-row">
        <aside className="shrink-0 lg:w-72 lg:max-h-[min(100dvh,920px)] lg:overflow-y-auto xl:w-80">
          <CommonTableFilter
            fields={filterFields}
            values={filterValues}
            onChange={setFilterValues}
            onReset={() => setFilterValues(defaultFilterValues)}
            onSubmit={() => usersQuery.refetch()}
          />
        </aside>

        <div className="min-w-0 flex-1">
          <CommonTable<UserRow>
            embed
            title=""
            columns={columns}
            data={rows}
            getRowKey={(row) => String(row.id)}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSortChange={(key, direction) => {
              setSortKey(key);
              setSortDirection(direction);
            }}
            actions={actions}
            pagination={false}
            emptyMessage={usersQuery.isLoading ? "Đang tải dữ liệu..." : "Không có dữ liệu."}
          />
        </div>
      </div>

      <CreateOrEditUserPanel
        key={`${panelState.mode}-${panelState.editingRow?.id ?? "new"}-${String(panelState.open)}`}
        open={panelState.open}
        mode={panelState.mode}
        editingUser={panelState.editingRow}
        token={token}
        onOpenChange={(open) => {
          setPanelState((prev) => ({ ...prev, open }));
        }}
      />
    </div>
  );
}

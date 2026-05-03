/**
 * Khớp `RoleDataSeeder` + `RoleNames` (BE): seed DB trống → identity 1, 2, 3.
 */
export const STATIC_USER_ROLES = [
  { id: 1, name: "admin", displayName: "Quản trị hệ thống" },
  { id: 2, name: "staff", displayName: "Nhân viên" },
  { id: 3, name: "customer", displayName: "Khách hàng" },
] as const;

export const STATIC_USER_ROLE_IDS = new Set<number>(
  STATIC_USER_ROLES.map((r) => r.id),
);

export const STATIC_USER_ROLE_SELECT_OPTIONS = STATIC_USER_ROLES.map((r) => ({
  value: String(r.id),
  label: r.displayName,
}));

/** Ưu tiên admin → staff → customer khi user có nhiều role (dropdown một giá trị). */
export function primaryRoleIdStringFromUser(
  roleNames: string[] | undefined,
): string {
  if (!roleNames?.length) return "";
  const lower = new Set(roleNames.map((n) => n.trim().toLowerCase()));
  for (const name of ["admin", "staff", "customer"] as const) {
    if (!lower.has(name)) continue;
    const row = STATIC_USER_ROLES.find((r) => r.name === name);
    if (row) return String(row.id);
  }
  return "";
}

export function parseStaticRoleIdToPayload(raw: string): number[] | null {
  const t = raw.trim();
  if (!t) return null;
  const id = Number(t);
  if (!Number.isInteger(id) || !STATIC_USER_ROLE_IDS.has(id)) return null;
  return [id];
}

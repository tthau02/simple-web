import { adminRoutes } from "@/config/routes";

export default function AdminHomePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <p className="text-[0.95rem] leading-relaxed text-[var(--text-secondary)]">
        Đây là vùng <strong className="font-semibold text-[var(--text-primary)]">admin</strong>{" "}
        (<code className="rounded-md bg-black/[0.06] px-1.5 py-0.5 text-sm">{adminRoutes.home}</code>
        ). Thêm trang con bằng cách tạo thư mục trong{" "}
        <code className="rounded-md bg-black/[0.06] px-1.5 py-0.5 text-sm">
          app/(admin)/admin/
        </code>{" "}
        và khai báo path trong{" "}
        <code className="rounded-md bg-black/[0.06] px-1.5 py-0.5 text-sm">
          src/config/routes.ts
        </code>
        .
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["Đơn hàng", "Sản phẩm", "Người dùng"].map((label) => (
          <div
            key={label}
            className="rounded-[12px] border border-black/[0.06] bg-white p-5 shadow-[0_0_0.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.08)]"
          >
            <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
            <p className="mt-2 text-xs text-[var(--text-secondary)]">Placeholder thống kê</p>
            <p className="mt-3 font-mono text-2xl font-semibold tabular-nums text-[var(--brand-heading)]">
              —
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

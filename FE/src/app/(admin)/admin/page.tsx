import { adminRoutes } from "@/config/routes";

const codeInline =
  "rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground";

export default function AdminHomePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <p className="text-[0.95rem] leading-relaxed text-muted-foreground">
        Đây là vùng <strong className="font-semibold text-foreground">admin</strong>{" "}
        (<code className={codeInline}>{adminRoutes.home}</code>). Thêm trang con bằng
        cách tạo thư mục trong{" "}
        <code className={codeInline}>app/(admin)/admin/</code> và khai báo path trong{" "}
        <code className={codeInline}>src/config/routes.ts</code>.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["Đơn hàng", "Sản phẩm", "Người dùng"].map((label) => (
          <div
            key={label}
            className="ds-surface-card-elevated border border-border p-5"
          >
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Placeholder thống kê
            </p>
            <p className="mt-3 font-mono text-2xl font-semibold tabular-nums text-[var(--brand-heading)]">
              —
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

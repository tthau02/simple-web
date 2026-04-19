import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { adminRoutes } from "@/config/routes";

export const metadata: Metadata = {
  title: "Trang chủ",
};

export default function ClientHomePage() {
  return (
    <>
      <section className="border-b border-black/[0.06] bg-[var(--page-canvas)] py-12 md:py-16 lg:py-20">
        <div className="mx-auto grid max-w-[var(--column-max)] gap-8 px-[var(--outer-gutter)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12">
          <div>
            <h1 className="text-[1.5rem] font-semibold leading-tight tracking-[-0.01em] text-[var(--brand-heading)] md:text-[2rem]">
              Cà phê ấm, không gian mở
            </h1>
            <p className="mt-4 max-w-xl text-[1.05rem] leading-relaxed text-[var(--text-secondary)] md:text-[1.15rem]">
              Demo trang khách theo DESIGN.md: nền kem, CTA xanh accent, thẻ
              trắng bo 12px. Nội dung và API sẽ gắn sau.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#"
                className="inline-flex items-center justify-center rounded-[50px] bg-[var(--brand-cta)] px-4 py-2 text-sm font-semibold tracking-[-0.01em] text-white transition-transform active:scale-[0.95] md:px-5 md:text-base"
              >
                Khám phá menu
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center rounded-[50px] border border-[var(--brand-cta)] bg-transparent px-4 py-2 text-sm font-semibold tracking-[-0.01em] text-[var(--brand-cta)] transition-transform active:scale-[0.95] md:px-5 md:text-base"
              >
                Đặt hàng
              </Link>
            </div>
          </div>
          <div
            className="relative flex min-h-[200px] items-center justify-center rounded-[12px] bg-[#edebe9] shadow-[0_0_0.5px_rgba(0,0,0,0.14),0_1px_1px_rgba(0,0,0,0.24)] md:min-h-[280px]"
            aria-hidden
          >
            <span className="text-sm text-[var(--text-secondary)]">
              Ảnh hero (placeholder)
            </span>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-[var(--column-max)] px-[var(--outer-gutter)]">
          <h2 className="text-[1.5rem] font-normal tracking-[-0.01em] text-[var(--text-primary)]">
            Gợi ý hôm nay
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {["Đồ uống", "Bánh ngọt", "Hạt và quà"].map((title) => (
              <article
                key={title}
                className="rounded-[12px] bg-white p-6 shadow-[0_0_0.5px_rgba(0,0,0,0.14),0_1px_1px_rgba(0,0,0,0.24)]"
              >
                <h3 className="text-base font-semibold tracking-[-0.01em] text-[var(--brand-heading)]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Thẻ nội dung demo — thay bằng dữ liệu thật sau.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-house)] py-12 text-white md:py-16">
        <div className="mx-auto flex max-w-[var(--column-max)] flex-col gap-6 px-[var(--outer-gutter)] md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-[1.5rem] font-semibold tracking-[-0.01em]">
              Khu vực quản trị
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">
              Router <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">/admin</code>{" "}
              tách biệt layout — dễ bảo vệ route và mở rộng module sau.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={adminRoutes.home}
              className="inline-flex items-center justify-center rounded-[50px] border border-white bg-white px-5 py-2.5 text-sm font-semibold tracking-[-0.01em] text-[var(--brand-cta)] transition-transform active:scale-[0.95]"
            >
              Mở Admin
            </Link>
            <Link
              href="#"
              className="inline-flex items-center justify-center rounded-[50px] border border-white bg-transparent px-5 py-2.5 text-sm font-semibold tracking-[-0.01em] text-white transition-transform active:scale-[0.95]"
            >
              Tìm hiểu thêm
            </Link>
          </div>
        </div>
      </section>

      {/* Frap-style floating CTA (design signature) */}
      <Link
        href="#"
        className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex h-14 w-14 -translate-y-2 items-center justify-center rounded-full bg-[var(--brand-cta)] text-white shadow-[0_0_6px_rgba(0,0,0,0.24),0_8px_12px_rgba(0,0,0,0.14)] transition-transform active:scale-[0.95] active:shadow-[0_0_6px_rgba(0,0,0,0.24),0_8px_12px_rgba(0,0,0,0)]"
        aria-label="Đặt hàng nhanh"
      >
        <ShoppingBag className="size-6" strokeWidth={1.75} />
      </Link>
    </>
  );
}

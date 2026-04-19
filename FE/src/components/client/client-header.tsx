import Link from "next/link";
import { adminRoutes, clientRoutes } from "@/config/routes";

const navLinks = [
  { href: clientRoutes.home, label: "Trang chủ" },
  { href: "#", label: "Menu" },
  { href: "#", label: "Rewards" },
  { href: "#", label: "Thẻ quà tặng" },
] as const;

export function ClientHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_2px_2px_rgba(0,0,0,0.06),0_0_2px_rgba(0,0,0,0.07)]">
      <div className="mx-auto flex h-16 max-w-[var(--column-max)] items-center justify-between gap-4 px-[var(--outer-gutter)] md:h-[4.5rem] lg:h-[5.5rem]">
        <div className="flex min-w-0 flex-1 items-center gap-6 lg:gap-10">
          <Link
            href={clientRoutes.home}
            className="shrink-0 text-lg font-semibold tracking-[-0.01em] text-[var(--brand-heading)] md:text-xl"
          >
            Café
          </Link>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Chính">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-normal tracking-[-0.01em] text-[var(--text-primary)] transition-colors hover:text-[var(--brand-heading)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="#"
            className="hidden text-sm tracking-[-0.01em] text-[var(--text-primary)] underline-offset-4 hover:underline sm:inline"
          >
            Tìm cửa hàng
          </Link>
          <Link
            href="#"
            className="rounded-[50px] border border-[var(--text-primary)] px-3 py-1.5 text-sm font-semibold tracking-[-0.01em] text-[var(--text-primary)] transition-transform active:scale-[0.95] sm:px-4"
          >
            Đăng nhập
          </Link>
          <Link
            href="#"
            className="rounded-[50px] bg-black px-3 py-1.5 text-sm font-semibold tracking-[-0.01em] text-white transition-transform active:scale-[0.95] sm:px-4"
          >
            Tham gia
          </Link>
          <Link
            href={adminRoutes.home}
            className="ml-1 rounded-[50px] border border-[var(--brand-house)] bg-transparent px-2.5 py-1.5 text-xs font-medium tracking-[-0.01em] text-[var(--brand-house)] transition-transform active:scale-[0.95] md:px-3 md:text-sm"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}

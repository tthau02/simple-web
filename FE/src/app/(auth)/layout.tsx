import Image from "next/image";

/**
 * Auth (/login, /register): không header/footer storefront.
 * Layout split như mockup (ảnh | form); màu nền theo DESIGN.md (cream + ceramic — không gradient tím).
 * Khung cố định viewport — không scroll dọc toàn trang (lg+); nội dung form được nén/grid cho register.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh max-h-dvh w-full overflow-hidden bg-[var(--page-canvas)]">
      <aside
        className="relative hidden h-dvh shrink-0 flex-col items-center justify-center overflow-hidden bg-[#edebe9] lg:flex lg:w-[54%] xl:w-[52%]"
        aria-hidden
      >
        <div className="flex h-full w-full items-center justify-center p-6 xl:p-10">
          <div className="ds-surface-card-elevated relative h-[min(100%,calc(100dvh-3rem))] w-full max-w-xl">
            <Image
              src="/auth-login-hero.png"
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 0px, 50vw"
              className="object-contain object-center p-4 transition-opacity duration-300 ease-in md:p-6"
            />
          </div>
        </div>
      </aside>

      <main className="flex h-dvh min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white pb-[env(safe-area-inset-bottom,0px)] lg:w-[46%] xl:max-w-[520px] xl:flex-none">
        <div className="flex min-h-0 flex-1 flex-col justify-center px-5 py-5 sm:px-8 xl:px-14">
          <div className="mx-auto min-h-0 w-full max-w-[26rem] overflow-hidden">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

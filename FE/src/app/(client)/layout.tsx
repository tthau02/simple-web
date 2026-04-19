import { ClientFooter } from "@/components/client/client-footer";
import { ClientHeader } from "@/components/client/client-header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-full flex-1 flex-col bg-[var(--page-canvas)]"
      data-app-shell="client"
    >
      <ClientHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <ClientFooter />
    </div>
  );
}

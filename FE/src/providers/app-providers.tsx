"use client";

import { QueryProvider } from "./query-provider";
import { ReduxProvider } from "./redux-provider";
import { AppToaster } from "@/components/ui/sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        {children}
        <AppToaster />
      </QueryProvider>
    </ReduxProvider>
  );
}

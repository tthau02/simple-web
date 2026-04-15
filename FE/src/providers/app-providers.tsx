"use client";

import { QueryProvider } from "./query-provider";
import { ReduxProvider } from "./redux-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>{children}</QueryProvider>
    </ReduxProvider>
  );
}

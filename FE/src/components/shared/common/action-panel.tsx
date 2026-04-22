"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type ActionPanelTab = {
  value: string;
  label: string;
};

export type ActionPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** Nội dung chính (ví dụ form) giữa header/tabs và footer. */
  children?: React.ReactNode;
  tabs?: ActionPanelTab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Trả về `false` để giữ panel mở (ví dụ lỗi validate). */
  onConfirm?: () => boolean | void;
  className?: string;
};

export function ActionPanel({
  open,
  onOpenChange,
  title,
  children,
  tabs,
  activeTab,
  onTabChange,
  confirmLabel = "Lưu",
  cancelLabel = "Hủy",
  onConfirm,
  className,
}: ActionPanelProps) {
  const hasTabs =
    Boolean(tabs?.length) &&
    typeof activeTab === "string" &&
    typeof onTabChange === "function";

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={cn("w-full max-w-184", className)}>
        <DrawerHeader className="gap-4 border-b border-black/8">
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        {hasTabs ? (
          <Tabs
            value={activeTab}
            onValueChange={onTabChange}
            className="p-4 pt-3"
          >
            <TabsList>
              {tabs!.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : null}

        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto px-4 py-3",
            hasTabs ? "pt-0" : "pt-1",
          )}
        >
          {children}
        </div>

        <DrawerFooter className="border-t border-black/8">
          <div className="flex items-center justify-center gap-3">
            <DrawerClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-8 rounded-[50px] border-[#00754A] px-3.5 text-xs font-semibold tracking-[-0.01em] text-[#00754A] transition-all duration-200 hover:bg-[#f2f0eb] active:scale-95"
              >
                {cancelLabel}
              </Button>
            </DrawerClose>
            <Button
              type="button"
              className="h-8 rounded-[50px] border border-[#00754A] bg-[#00754A] px-3.5 text-xs font-semibold tracking-[-0.01em] text-white transition-all duration-200 hover:border-[#006241] hover:bg-[#006241] active:scale-95"
              onClick={() => {
                const keepOpen = onConfirm?.() === false;
                if (keepOpen) return;
                onOpenChange(false);
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
